import Application from "../models/application.model.js";
import Opportunity from "../models/opportunity.model.js";
import Volunteer from "../models/volunteer.model.js";
import Notification from "../models/notification.model.js";
import Organization from "../models/organization.model.js";
import User from "../models/user.model.js";

export const ApplicationService = {
  async listByOpportunity(opportunityId, userId) {
    // 1. Find organization linked to this user
    const organization = await Organization.findOne({
      where: { userId },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    // 2. Verify opportunity ownership
    const opportunity = await Opportunity.findOne({
      where: {
        opportunityId,
        organizationId: organization.organizationId,
      },
    });

    if (!opportunity) {
      return [];
    }

    // 3. Fetch applications
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

    if (application.status !== "pending") {
      throw new Error(
        `Application already ${application.status}. Review is final.`
      );
    }

    application.status = decision;
    await application.save();

    return application;
  },

  async apply(volunteerId, opportunityId) {
    // First check if the volunteer exists
    const hasVolunteer = await Volunteer.findByPk(volunteerId);

    if (!hasVolunteer) {
      return { error: "Volunteer not found" };
    }

    // Check if opportunity in question exists
    const hasOpportunity = await Opportunity.findByPk(opportunityId);

    if (!hasOpportunity) {
      return { error: "Opportunity not found." };
    }

    // Check for duplication application
    const hasDoubleApplication = await Application.findOne({
      where: { volunteerId, opportunityId },
    });

    if (hasDoubleApplication) {
      return { error: "You have already applied to this opportunity." };
    }

    // Create Application
    const newApplication = await Application.create({
      volunteerId,
      opportunityId,
      status: "pending",
    });

    await Notification.create({
      userId: organization.userId,
      message: `New application for the opportunity "${Opportunity.title}".`,
    });

    return newApplication;
  },

  async getMyApplications(volunteerId) {
    return await Application.findAll({
      where: { volunteerId },
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
};
