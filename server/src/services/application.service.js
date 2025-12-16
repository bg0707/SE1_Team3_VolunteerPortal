import Application from "../models/application.model.js"
import Opportunity from "../models/opportunity.model.js"
import Volunteer from "../models/volunteer.model.js"
import Organization from "../models/organization.model.js";

export const ApplicationService = {

    async apply(userId, opportunityId) {

    // 1. Find the volunteer USING userId
    const volunteer = await Volunteer.findOne({ where: { userId } });

    if (!volunteer) {
        return { error: "Volunteer not found" };
    }

    const volunteerId = volunteer.volunteerId; // <- REAL volunteer PK

    // 2. Check if opportunity exists
    const opportunity = await Opportunity.findByPk(opportunityId);
    if (!opportunity) {
        return { error: "Opportunity not found." };
    }

    // 3. Check duplicate application
    const existing = await Application.findOne({
        where: { volunteerId, opportunityId },
    });

    if (existing) {
        return { error: "You have already applied to this opportunity." };
    }

    // 4. Create application with REAL volunteerId
    const newApplication = await Application.create({
        volunteerId,
        opportunityId,
        status: "pending",
    });

    return newApplication;
},

    async getMyApplications(userId) {

    // 1. Find volunteer using userId
    const volunteer = await Volunteer.findOne({ where: { userId } });

    if (!volunteer) {
        return []; // or { error: "Volunteer not found" }
    }

    const volunteerId = volunteer.volunteerId;

    // 2. Fetch applications using REAL volunteerId
    return await Application.findAll({
        where: { volunteerId },
        include: [
            {
                model: Opportunity,
                as: "opportunity",
                include: [{ model: Organization, as: "organization" }],
            }
        ],
        order: [["createdAt", "DESC"]],
    });
    },

}