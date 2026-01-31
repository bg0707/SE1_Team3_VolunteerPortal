import { ApplicationService } from "../services/application.service.js";

export class ApplicationController {
  static async listByOpportunity(req, res) {
    try {
      const { opportunityId } = req.params;
      const userId = req.user.userId;

      const data = await ApplicationService.listByOpportunity(
        opportunityId,
        userId
      );

      return res.json(data);
    } catch (err) {
      console.error("List applications by opportunity error:", err);
      res.status(500).json({ message: err.message });
    }
  }

  static async review(req, res) {
    try {
      if (req.user.role !== "organization") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const { applicationId } = req.params;
      const { decision } = req.body;
      const organizationUserId = req.user.userId;

      const application = await ApplicationService.reviewForOrganization(
        applicationId,
        decision,
        organizationUserId
      );

      return res.status(200).json({
        message: "Application reviewed.",
        application,
      });
    } catch (err) {
      console.error("Review application error:", err);

      if (err.message.includes("already")) {
        return res.status(409).json({ message: err.message });
      }

      if (err.message.includes("Invalid decision")) {
        return res.status(400).json({ message: err.message });
      }

      if (err.message.includes("Unauthorized")) {
        return res.status(403).json({ message: err.message });
      }

      if (err.message.includes("not found")) {
        return res.status(404).json({ message: err.message });
      }

      return res.status(500).json({ message: "Server error" });
    }
  }

  static async apply(req, res) {
    try {
      const { volunteerId, opportunityId } = req.body;

      if (!volunteerId || !opportunityId) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const result = await ApplicationService.apply(volunteerId, opportunityId);

      if (result.error) {
        return res.status(400).json({ message: result.error });
      }

      return res.status(201).json({
        message: "Application submitted.",
        application: result,
      });
    } catch (error) {
      console.error("Apply error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  static async getMyApplications(req, res) {
    try {
      const { volunteerId } = req.params;
      const applications = await ApplicationService.getMyApplications(
        volunteerId
      );
      return res.json(applications);
    } catch (err) {
      console.error("Get applications:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const { applicationId } = req.params;
      const data = req.body;

      const updated = await ApplicationService.update(applicationId, data);

      if (updated.error) {
        return res.status(400).json({ message: updated.error });
      }

      return res.json({
        message: "Application updated.",
        application: updated,
      });
    } catch (err) {
      console.error("Update application error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }

  static async cancel(req, res) {
    try {
      if (req.user.role !== "volunteer") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const { applicationId } = req.params;
      const userId = req.user.userId;

      const application = await ApplicationService.cancel(applicationId, userId);

      return res.status(200).json({
        message: "Application cancelled.",
        application,
      });
    } catch (err) {
      console.error("Cancel application error:", err);

      if (err.message.includes("Unauthorized")) {
        return res.status(403).json({ message: err.message });
      }

      if (err.message.includes("not found")) {
        return res.status(404).json({ message: err.message });
      }

      if (err.message.includes("already") || err.message.includes("Only pending")) {
        return res.status(409).json({ message: err.message });
      }

      return res.status(500).json({ message: "Server error" });
    }
  }
}

export default ApplicationController;
