import sequelize from "../config/db.js";

import Application from "../models/application.model.js";
import Opportunity from "../models/opportunity.model.js";
import Organization from "../models/organization.model.js";
import Report from "../models/report.model.js";
import User from "../models/user.model.js";
import Volunteer from "../models/volunteer.model.js";
import { Op } from "sequelize";
import Notification from "../models/notification.model.js";

export const AdminService = {
  /**
   * Returns a list of opportunities that have at least one report.
   * The payload is already grouped per opportunity to make frontend rendering easy.
   */
  async getReportedOpportunities() {
    const reports = await Report.findAll({
      include: [
        {
          model: Volunteer,
          as: "volunteer",
          include: [{ model: User, as: "user", attributes: ["userId", "email"] }],
        },
        {
          model: Opportunity,
          as: "opportunity",
          include: [
            {
              model: Organization,
              as: "organization",
              include: [{ model: User, as: "user", attributes: ["userId", "email"] }],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const grouped = new Map();

    for (const r of reports) {
      const opp = r.opportunity;
      if (!opp) continue;

      if (!grouped.has(opp.opportunityId)) {
        grouped.set(opp.opportunityId, {
          opportunity: opp,
          reportCount: 0,
          reports: [],
        });
      }

      const entry = grouped.get(opp.opportunityId);
      entry.reportCount += 1;
      entry.reports.push(r);
    }

    return Array.from(grouped.values());
  },

  /**
   * "Keep" means we consider the listing acceptable and clear its reports.
   * We delete reports because the current schema has no "resolved" flag.
   */
  async keepOpportunity(opportunityId) {
    const opportunity = await Opportunity.findByPk(opportunityId);
    if (!opportunity) return { error: "Opportunity not found." };

    await Report.destroy({ where: { opportunityId } });
    return { ok: true };
  },

  /**
   * "Remove" deletes the opportunity and all dependent rows that reference it.
   */
  async removeOpportunity(opportunityId, reason = "") {
    return await sequelize.transaction(async (t) => {
      const opportunity = await Opportunity.findByPk(opportunityId, {
        transaction: t,
      });
      if (!opportunity) return { error: "Opportunity not found." };

      const organization = await Organization.findByPk(opportunity.organizationId, {
        transaction: t,
      });

      await Application.destroy({ where: { opportunityId }, transaction: t });
      await Report.destroy({ where: { opportunityId }, transaction: t });
      await Opportunity.destroy({ where: { opportunityId }, transaction: t });

      if (organization) {
        await Notification.create(
          {
            userId: organization.userId,
            message: `Your opportunity "${opportunity.title}" was removed. Reason: ${reason || "Not specified"}.`,
          },
          { transaction: t }
        );
      }

      return { ok: true };
    });
  },

  /**
   * "Suspend" hides the opportunity without deleting it.
   */
  async suspendOpportunity(opportunityId, reason = "") {
    const opportunity = await Opportunity.findByPk(opportunityId);
    if (!opportunity) return { error: "Opportunity not found." };

    if (opportunity.status === "suspended") {
      return { ok: true };
    }

    await opportunity.update({ status: "suspended" });

    const organization = await Organization.findByPk(opportunity.organizationId);
    if (organization) {
      await Notification.create({
        userId: organization.userId,
        message: `Your opportunity "${opportunity.title}" was suspended. Reason: ${reason || "Not specified"}.`,
      });
    }

    return { ok: true };
  },

  /**
   * "Unsuspend" restores visibility of a suspended opportunity.
   */
  async unsuspendOpportunity(opportunityId) {
    const opportunity = await Opportunity.findByPk(opportunityId);
    if (!opportunity) return { error: "Opportunity not found." };

    if (opportunity.status === "active") {
      return { ok: true };
    }

    await opportunity.update({ status: "active" });

    const organization = await Organization.findByPk(opportunity.organizationId);
    if (organization) {
      await Notification.create({
        userId: organization.userId,
        message: `Your opportunity "${opportunity.title}" was reinstated.`,
      });
    }

    return { ok: true };
  },

  async listPendingOrganizations() {
    return Organization.findAll({
      where: { isVerified: false },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["userId", "email", "status"],
          where: { status: { [Op.ne]: "deactivated" } },
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  },

  async verifyOrganization(organizationId) {
    const org = await Organization.findByPk(organizationId);
    if (!org) return { error: "Organization not found." };

    org.isVerified = true;
    await org.save();
    const user = await User.findByPk(org.userId);
    if (user && user.status !== "active") {
      user.status = "active";
      await user.save();
    }
    return { ok: true, organization: org };
  },

  /**
   * Rejecting deletes the organization and its user.
   * If the organization has opportunities, we also clean them up.
   */
  async rejectOrganization(organizationId) {
    const org = await Organization.findByPk(organizationId);
    if (!org) return { error: "Organization not found." };

    const user = await User.findByPk(org.userId);
    if (user) {
      user.status = "deactivated";
      await user.save();
    }

    org.isVerified = false;
    await org.save();

    return { ok: true };
  },

  async listUsers({ search, role, status, limit = 10, offset = 0 }) {
    const where = {};
    if (role) {
      const roles = String(role)
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      if (roles.length > 1) {
        where.role = { [Op.in]: roles };
      } else if (roles.length === 1) {
        where.role = roles[0];
      }
    }
    if (status) where.status = status;

    const users = await User.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    const volunteerUserIds = users
      .filter((u) => u.role === "volunteer")
      .map((u) => u.userId);
    const organizationUserIds = users
      .filter((u) => u.role === "organization")
      .map((u) => u.userId);

    const volunteers = volunteerUserIds.length
      ? await Volunteer.findAll({ where: { userId: { [Op.in]: volunteerUserIds } } })
      : [];
    const organizations = organizationUserIds.length
      ? await Organization.findAll({
          where: { userId: { [Op.in]: organizationUserIds } },
        })
      : [];

    const volunteerByUserId = new Map(
      volunteers.map((v) => [v.userId, v])
    );
    const organizationByUserId = new Map(
      organizations.map((o) => [o.userId, o])
    );

    const rows = users.map((user) => {
      const volunteer = volunteerByUserId.get(user.userId);
      const organization = organizationByUserId.get(user.userId);
      const name =
        volunteer?.fullName ??
        organization?.name ??
        (user.role === "admin" ? "Admin" : "User");

      return {
        userId: user.userId,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        name,
      };
    });

    const normalizedSearch = search?.trim().toLowerCase();
    const filtered = normalizedSearch
      ? rows.filter(
          (row) =>
            row.email.toLowerCase().includes(normalizedSearch) ||
            row.name.toLowerCase().includes(normalizedSearch)
        )
      : rows;

    const total = filtered.length;
    const paged = filtered.slice(offset, offset + limit);

    return { total, users: paged };
  },

  async getUserDetails(userId) {
    const user = await User.findByPk(userId);
    if (!user) return null;

    const [volunteer, organization] = await Promise.all([
      Volunteer.findOne({ where: { userId } }),
      Organization.findOne({ where: { userId } }),
    ]);

    return { user, volunteer, organization };
  },

  async updateUserStatus(userId, status) {
    const user = await User.findByPk(userId);
    if (!user) return null;

    user.status = status;
    await user.save();
    return user;
  },

  async listOrganizations({ search, verificationStatus, limit = 10, offset = 0 }) {
    const organizations = await Organization.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["userId", "email", "status"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const rows = organizations.map((org) => {
      const userStatus = org.user?.status ?? "active";
      const status = org.isVerified
        ? "verified"
        : userStatus === "deactivated"
        ? "rejected"
        : "pending";

      return {
        organizationId: org.organizationId,
        userId: org.userId,
        name: org.name,
        email: org.user?.email ?? "",
        description: org.description,
        isVerified: org.isVerified,
        userStatus,
        verificationStatus: status,
        createdAt: org.createdAt,
      };
    });

    const normalizedSearch = search?.trim().toLowerCase();
    const filtered = rows.filter((row) => {
      if (verificationStatus && row.verificationStatus !== verificationStatus) {
        return false;
      }
      if (!normalizedSearch) return true;
      return (
        row.name.toLowerCase().includes(normalizedSearch) ||
        row.email.toLowerCase().includes(normalizedSearch)
      );
    });

    const total = filtered.length;
    const paged = filtered.slice(offset, offset + limit);

    const enriched = await Promise.all(
      paged.map(async (org) => {
        const opportunitiesCreated = await Opportunity.count({
          where: { organizationId: org.organizationId },
        });
        const applicationsReceived = await Application.count({
          include: [
            {
              model: Opportunity,
              as: "opportunity",
              where: { organizationId: org.organizationId },
            },
          ],
        });
        const volunteersApplied = await Application.count({
          distinct: true,
          col: "volunteerId",
          include: [
            {
              model: Opportunity,
              as: "opportunity",
              where: { organizationId: org.organizationId },
            },
          ],
        });

        return {
          ...org,
          opportunitiesCreated,
          applicationsReceived,
          volunteersApplied,
        };
      })
    );

    return { total, organizations: enriched };
  },

  async getOrganizationDetails(organizationId) {
    const organization = await Organization.findByPk(organizationId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["userId", "email", "status", "createdAt"],
        },
      ],
    });
    if (!organization) return null;

    const opportunitiesCreated = await Opportunity.count({
      where: { organizationId },
    });
    const applicationsReceived = await Application.count({
      include: [
        {
          model: Opportunity,
          as: "opportunity",
          where: { organizationId },
        },
      ],
    });
    const volunteersApplied = await Application.count({
      distinct: true,
      col: "volunteerId",
      include: [
        {
          model: Opportunity,
          as: "opportunity",
          where: { organizationId },
        },
      ],
    });

    return {
      organizationId: organization.organizationId,
      userId: organization.userId,
      name: organization.name,
      description: organization.description,
      isVerified: organization.isVerified,
      createdAt: organization.createdAt,
      user: organization.user,
      opportunitiesCreated,
      applicationsReceived,
      volunteersApplied,
    };
  },

  async listAllOpportunities({ limit = 10, offset = 0 }) {
    const total = await Opportunity.count();
    const opportunities = await Opportunity.findAll({
      include: [
        {
          model: Organization,
          as: "organization",
          include: [{ model: User, as: "user", attributes: ["userId", "email"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return { total, opportunities };
  },
};
