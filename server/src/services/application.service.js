import Application from "../models/application.model.js"
import Opportunity from "../models/opportunity.model.js"
import Volunteer from "../models/volunteer.model.js"
import Notification from "../models/notification.model.js"
import Organization from "../models/organization.model.js";
import User from "../models/user.model.js";

export const ApplicationService = {

    async listByOpportunity(opportunityId) {
        return Application.findAll({
            where: { opportunityId },
            include: [
                {
                model: Volunteer,
                as: "volunteer",
                include: [{ model: User, as: "user" }], // need email
                },
            ],
            order: [["createdAt", "DESC"]],
        });
    },

    async review(applicationId, decision) {
        if (!["accepted", "rejected"].includes(decision)) {
            return { error: "Invalid decision" };
        }

        const application = await Application.findByPk(applicationId, {
          include: [
            {
              model: Volunteer,
              as: "volunteer",
              include: [{ model: User, as: "user" }],
            },
          ],
        });

        if (!application) {
            return { error: "Application not found." };
        }

        application.status = decision;
        await application.save();

        // Optional: create notification to volunteer.userId
        // await Notification.create({ userId: application.volunteer.user.userId, message: `Application ${decision}.` });

        return application;
      },

    async apply(volunteerId, opportunityId) {

        // First check if the volunteer exists 
        const hasVolunteer = await Volunteer.findByPk(volunteerId);

        if(!hasVolunteer) {
            return {error: "Volunteer not found"};
        }

        // Check if opportunity in question exists
        const hasOpportunity = await Opportunity.findByPk(opportunityId);

        if(!hasOpportunity) {
            return {error: "Opportunity not found."};
        }

        // Check for duplication application
        const hasDoubleApplication = await Application.findOne({
            where: {volunteerId, opportunityId},
        });

        if(hasDoubleApplication) {
            return {error: "You have already applied to this opportunity."}
        }

        

        // Create Application
        const newApplication = await Application.create({
            volunteerId, 
            opportunityId,
            status: "pending",
        });

        await Notification.create({
            userId: organization.userId,
            message: `New application for the opportunity "${Opportunity.title}".`
        })

        return newApplication;
    },

    async getMyApplications(volunteerId) {
        return await Application.findAll({
            where: {volunteerId},
            include: [
                {
                    model: Opportunity,
                    as: "opportunity",
                    include: [{ model: Organization, as: "organization"}]
                }
            ],
            order: [[ "createdAt", "DESC"]],
        });
    },

    async getMyApplicationDetails(applicationId) {
        return await Application.findOne({
            where: { applicationId}, 
            include: [
                {
                    model: Opportunity, 
                    as: "opportunity",
                    include: [{ model: Organization, as: "organization"}]
                }
            ]
        });
    },

    async cancel(applicationId, reason) {
        const application = await Application.findByPk(applicationId, {
            include: [
                {
                    model: Opportunity,
                    as: "opportunity",
                    include: [{ model: Organization, as: "organization"}]
                }
            ]
        });

        if(!application) {
            return { error: "Application not found."};
        }

        if(application.status = "cancelled") {
            return { error: "Application is already cancelled."};
        }

        application.status = "cancelled";
        await application.save();

        await Notification.create({
            userId: application.opportunity.organization.userId,
            message: `A volunteer cancelled their application for "${app.opportunity.title}".`,
        });

        return application;
    },

    async update(applicationId, data) {
        const application = await Application.findByPk(applicationId);

        if(!application) {
            return {error: "Application not found."};
        }

        Object.assign(application, data);
        await application.save();

        return application;
    }
}