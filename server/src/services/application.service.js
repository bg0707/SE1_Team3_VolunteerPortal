import Application from "../models/application.model.js";
import Opportunity from "../models/opportunity.model.js";
import Volunteer from "../models/volunteer.model.js";
import Organization from "../models/organization.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const ApplicationService = {

  async listByOpportunity(opportunityId, userId) {
    // Find organization for this user
    const organization = await Organization.findOne({
      where: { userId },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    // Verify ownership of opportunity
    const opportunity = await Opportunity.findOne({
      where: {
        opportunityId,
        organizationId: organization.organizationId,
      },
    });

    if (!opportunity) {
      // Not owner → see nothing
      return [];
    }

    return Application.findAll({
      where: { opportunityId },
      include: [
        {
          model: Volunteer,
          as: "volunteer",
          include: [{ model: User, as: "user" }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  },

 
  async reviewForOrganization(applicationId, decision, organizationUserId) {
    if (!["accepted", "rejected"].includes(decision)) {
      throw new Error("Invalid decision");
    }

    const application = await Application.findByPk(applicationId, {
      include: [
        {
          model: Opportunity,
          as: "opportunity",
          include: {
            model: Organization,
            as: "organization",
            where: { userId: organizationUserId },
          },
        },
        {
          model: Volunteer,
          as: "volunteer",
          include: [{ model: User, as: "user" }],
        },
      ],
    });

    if (!application) {
      throw new Error("Unauthorized or application not found");
    }

    // 🔒 Final decision protection
    if (application.status !== "pending") {
      throw new Error(
        `Application already ${application.status}. Review is final.`
      );
    }

    application.status = decision;
    await application.save();

    await Notification.create({
      userId: application.volunteer.user.userId,
      message: `Your application for "${application.opportunity.title}" was ${decision}.`,
    });

    return application;
  },


  async apply(userId, opportunityId) {
    // Find volunteer via userId
    const volunteer = await Volunteer.findOne({ where: { userId } });

    if (!volunteer) {
      return { error: "Volunteer not found" };
    }

    // Check opportunity
    const opportunity = await Opportunity.findByPk(opportunityId);
    if (!opportunity) {
      return { error: "Opportunity not found." };
    }

    // Prevent duplicate applications
    const existing = await Application.findOne({
      where: { volunteerId: volunteer.volunteerId, opportunityId },
    });

    if (existing) {
      if (existing.status !== "cancelled") {
        return { error: "You have already applied to this opportunity." };
      }

      existing.status = "pending";
      await existing.save();

      const organization = await Organization.findByPk(
        opportunity.organizationId
      );
      if (organization) {
        const volunteerName = volunteer.fullName ?? "A volunteer";
        await Notification.create({
          userId: organization.userId,
          message: `${volunteerName} applied for "${opportunity.title}".`,
        });
      }

      return existing;
    }

    const application = await Application.create({
      volunteerId: volunteer.volunteerId,
      opportunityId,
      status: "pending",
    });

    const organization = await Organization.findByPk(opportunity.organizationId);
    if (organization) {
      const volunteerName = volunteer.fullName ?? "A volunteer";
      await Notification.create({
        userId: organization.userId,
        message: `${volunteerName} applied for "${opportunity.title}".`,
      });
    }

    return application;
  },


  async getMyApplications(userId) {
    const volunteer = await Volunteer.findOne({ where: { userId } });

    if (!volunteer) {
      return [];
    }

    return Application.findAll({
      where: { volunteerId: volunteer.volunteerId },
      include: [
        {
          model: Opportunity,
          as: "opportunity",
          include: [{ model: Organization, as: "organization" }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  },


  async update(applicationId, data) {
    const application = await Application.findByPk(applicationId);

    if (!application) {
      return { error: "Application not found." };
    }

    Object.assign(application, data);
    await application.save();

    return application;
  },

  async cancel(applicationId, userId) {
    const volunteer = await Volunteer.findOne({ where: { userId } });

    if (!volunteer) {
      throw new Error("Volunteer not found.");
    }

    const application = await Application.findByPk(applicationId, {
      include: [
        {
          model: Opportunity,
          as: "opportunity",
          include: [{ model: Organization, as: "organization" }],
        },
      ],
    });

    if (!application) {
      throw new Error("Application not found.");
    }

    if (application.volunteerId !== volunteer.volunteerId) {
      throw new Error("Unauthorized to cancel this application.");
    }

    if (application.status === "cancelled") {
      throw new Error("Application already cancelled.");
    }

    if (!["pending", "accepted"].includes(application.status)) {
      throw new Error("Only pending or accepted applications can be cancelled.");
    }

    application.status = "cancelled";
    await application.save();

    const organization = application.opportunity?.organization;
    if (organization) {
      const volunteerName = volunteer.fullName ?? "A volunteer";
      await Notification.create({
        userId: organization.userId,
        message: `${volunteerName} cancelled their application for "${application.opportunity.title}".`,
      });
    }

    return application;
  },
};
