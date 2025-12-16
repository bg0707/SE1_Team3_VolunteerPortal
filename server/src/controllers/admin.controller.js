import { AdminService } from "../services/admin.service.js";

export const AdminController = {
  async getReportedOpportunities(req, res) {
    try {
      const data = await AdminService.getReportedOpportunities();
      res.status(200).json(data);
    } catch (error) {
      console.error("Admin getReportedOpportunities error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async moderateOpportunity(req, res) {
    try {
      const opportunityId = Number(req.params.opportunityId);
      const { decision } = req.body;

      if (!opportunityId || !decision) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      if (decision === "keep") {
        const result = await AdminService.keepOpportunity(opportunityId);
        if (result?.error) return res.status(404).json({ message: result.error });
        return res.status(200).json({ message: "Opportunity kept. Reports cleared." });
      }

      if (decision === "remove") {
        const result = await AdminService.removeOpportunity(opportunityId);
        if (result?.error) return res.status(404).json({ message: result.error });
        return res.status(200).json({ message: "Opportunity removed." });
      }

      return res.status(400).json({ message: "Invalid decision. Use 'keep' or 'remove'." });
    } catch (error) {
      console.error("Admin moderateOpportunity error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async listPendingOrganizations(req, res) {
    try {
      const organizations = await AdminService.listPendingOrganizations();
      res.status(200).json(organizations);
    } catch (error) {
      console.error("Admin listPendingOrganizations error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async reviewOrganization(req, res) {
    try {
      const organizationId = Number(req.params.organizationId);
      const { decision } = req.body;

      if (!organizationId || !decision) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      if (decision === "accept") {
        const result = await AdminService.verifyOrganization(organizationId);
        if (result?.error) return res.status(404).json({ message: result.error });
        return res.status(200).json({ message: "Organization verified.", organization: result.organization });
      }

      if (decision === "reject") {
        const result = await AdminService.rejectOrganization(organizationId);
        if (result?.error) return res.status(404).json({ message: result.error });
        return res.status(200).json({ message: "Organization rejected and removed." });
      }

      return res.status(400).json({ message: "Invalid decision. Use 'accept' or 'reject'." });
    } catch (error) {
      console.error("Admin reviewOrganization error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};
