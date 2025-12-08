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

    static async getMyApplications(req, res) {
        try {
            const {volunteerId} = req.params;
            const applications = await ApplicationService.getMyApplications(volunteerId);
            return res.json(applications);
        } catch (err) {
            console.error("Get applications:", err);
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }

    static async getMyApplicationDetails(req, res) {
        try {
            const { applicationId } = req.params;
            const application = await ApplicationService.getMyApplicationDetails(applicationId);

            if(!application) {
                return res.status(404).json({ message: "Application not found" });
            }

            return res.status(404).json({ message: "Application not found"});
        } catch (err) {
            console.error("Get application details error", err);
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }

    static async cancel(req, res) {
        try {

            const { applicationId } = req.params;
            const { reason } = req.body;

            const result  = await ApplicationService.cancel(applicationId, reason);

            if(result.error) {
                return res.status(400).json({ message: result.error });
            }

            return res.json({ message: "Application cancelled.", application: result });

        } catch (err) {
            console.error("Cancel applications error", err);
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }

    static async update(req, res) {
        try {
            const {applicationId} = req.params;
            const data  = req.body;

            const updated = await ApplicationService.update(applicationId, data);

            if (updated.error) {
                return res.status(400).json({ message: updated.error });
            }

            return res.json({ message: "Application updated.", application: updated });
        } catch (err) {
            console.error("Update application error:", err);
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }
}

export default ApplicationController;