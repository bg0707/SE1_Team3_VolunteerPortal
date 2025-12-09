import { ApplicationService } from "../services/application.service.js";

export class ApplicationController {

    static async apply(req, res) {

        try {
            const {volunteerId, opportunityId} = req.body;

            if(!volunteerId || !opportunityId) {
                return res.status(400).json({ message: "Missing required fields."})
            }

            const result = await ApplicationService.apply(volunteerId, opportunityId);

            if(result.error) {
                return res.status(400).json({ message: result.error})
            }

            return res.status(201).json({
                message: "Application submitted.",
                application: result,
            })
        } catch (error) {
            console.error("Apply error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

export default ApplicationController;