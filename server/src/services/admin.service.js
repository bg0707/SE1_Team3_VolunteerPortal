import sequelize from "../config/db.js";

import Application from "../models/application.model.js";
import Opportunity from "../models/opportunity.model.js";
import Organization from "../models/organization.model.js";
import Report from "../models/report.model.js";
import User from "../models/user.model.js";
import Volunteer from "../models/volunteer.model.js";

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
  async removeOpportunity(opportunityId) {
    return await sequelize.transaction(async (t) => {
      const opportunity = await Opportunity.findByPk(opportunityId, { transaction: t });
      if (!opportunity) return { error: "Opportunity not found." };

      await Application.destroy({ where: { opportunityId }, transaction: t });
      await Report.destroy({ where: { opportunityId }, transaction: t });
      await Opportunity.destroy({ where: { opportunityId }, transaction: t });

      return { ok: true };
    });
  },

  async listPendingOrganizations() {
    return Organization.findAll({
      where: { isVerified: false },
      include: [{ model: User, as: "user", attributes: ["userId", "email"] }],
      order: [["createdAt", "DESC"]],
    });
  },

  async verifyOrganization(organizationId) {
    const org = await Organization.findByPk(organizationId);
    if (!org) return { error: "Organization not found." };

    org.isVerified = true;
    await org.save();
    return { ok: true, organization: org };
  },

  /**
   * Rejecting deletes the organization and its user.
   * If the organization has opportunities, we also clean them up.
   */
  async rejectOrganization(organizationId) {
    return await sequelize.transaction(async (t) => {
      const org = await Organization.findByPk(organizationId, { transaction: t });
      if (!org) return { error: "Organization not found." };

      // Delete all opportunities (and their dependencies)
      const opportunities = await Opportunity.findAll({
        where: { organizationId },
        transaction: t,
      });

      for (const opp of opportunities) {
        await Application.destroy({ where: { opportunityId: opp.opportunityId }, transaction: t });
        await Report.destroy({ where: { opportunityId: opp.opportunityId }, transaction: t });
        await Opportunity.destroy({ where: { opportunityId: opp.opportunityId }, transaction: t });
      }

      // Delete organization, then its user
      await Organization.destroy({ where: { organizationId }, transaction: t });
      await User.destroy({ where: { userId: org.userId }, transaction: t });

      return { ok: true };
    });
  },
};
