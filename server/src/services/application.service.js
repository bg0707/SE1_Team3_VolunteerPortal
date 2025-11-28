import Application from "../models/application.model.js"
import Opportunity from "../models/opportunity.model.js"
import Volunteer from "../models/volunteer.model.js"
import Notification from "../models/notification.model.js"
import Organization from "../models/organization.model.js";

export const ApplicationService = {

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
    }
}