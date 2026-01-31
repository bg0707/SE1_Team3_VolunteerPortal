
import { AdminService } from "../services/admin.service.js";
import { ActivityLogService } from "../services/activityLog.service.js";

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
        await ActivityLogService.log({
          actorUserId: req.user.userId,
          action: "admin.opportunity.keep",
          entityType: "opportunity",
          entityId: opportunityId,
        });
        return res.status(200).json({ message: "Opportunity kept. Reports cleared." });
      }

      if (decision === "remove") {
        const { reason } = req.body;
        if (!reason) {
          return res.status(400).json({ message: "Removal reason is required." });
        }
        const result = await AdminService.removeOpportunity(opportunityId, reason);
        if (result?.error) return res.status(404).json({ message: result.error });
        await ActivityLogService.log({
          actorUserId: req.user.userId,
          action: "admin.opportunity.remove",
          entityType: "opportunity",
          entityId: opportunityId,
          metadata: { reason },
        });
        return res.status(200).json({ message: "Opportunity removed." });
      }

      if (decision === "suspend") {
        const { reason } = req.body;
        if (!reason) {
          return res.status(400).json({ message: "Suspension reason is required." });
        }
        const result = await AdminService.suspendOpportunity(opportunityId, reason);
        if (result?.error) return res.status(404).json({ message: result.error });
        await ActivityLogService.log({
          actorUserId: req.user.userId,
          action: "admin.opportunity.suspend",
          entityType: "opportunity",
          entityId: opportunityId,
          metadata: { reason },
        });
        return res.status(200).json({ message: "Opportunity suspended." });
      }

      if (decision === "unsuspend") {
        const result = await AdminService.unsuspendOpportunity(opportunityId);
        if (result?.error) return res.status(404).json({ message: result.error });
        await ActivityLogService.log({
          actorUserId: req.user.userId,
          action: "admin.opportunity.unsuspend",
          entityType: "opportunity",
          entityId: opportunityId,
        });
        return res.status(200).json({ message: "Opportunity reinstated." });
      }

      return res
        .status(400)
        .json({ message: "Invalid decision. Use 'keep', 'remove', 'suspend', or 'unsuspend'." });
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
        await ActivityLogService.log({
          actorUserId: req.user.userId,
          action: "admin.organization.accept",
          entityType: "organization",
          entityId: organizationId,
        });
        return res.status(200).json({ message: "Organization verified.", organization: result.organization });
      }

      if (decision === "reject") {
        const result = await AdminService.rejectOrganization(organizationId);
        if (result?.error) return res.status(404).json({ message: result.error });
        await ActivityLogService.log({
          actorUserId: req.user.userId,
          action: "admin.organization.reject",
          entityType: "organization",
          entityId: organizationId,
        });
        return res.status(200).json({ message: "Organization rejected and removed." });
      }

      return res.status(400).json({ message: "Invalid decision. Use 'accept' or 'reject'." });
    } catch (error) {
      console.error("Admin reviewOrganization error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async listUsers(req, res) {
    try {
      const { search, role, status, limit, offset } = req.query;
      const parsedLimit = Number(limit ?? 10);
      const parsedOffset = Number(offset ?? 0);
      const safeLimit = Number.isFinite(parsedLimit)
        ? Math.min(Math.max(parsedLimit, 1), 50)
        : 10;
      const safeOffset = Number.isFinite(parsedOffset) ? Math.max(parsedOffset, 0) : 0;

      const data = await AdminService.listUsers({
        search,
        role,
        status,
        limit: safeLimit,
        offset: safeOffset,
      });

      res.status(200).json(data);
    } catch (error) {
      console.error("Admin listUsers error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async getUserDetails(req, res) {
    try {
      const userId = Number(req.params.userId);
      if (!userId) {
        return res.status(400).json({ message: "Invalid user id." });
      }

      const data = await AdminService.getUserDetails(userId);
      if (!data) return res.status(404).json({ message: "User not found." });

      res.status(200).json(data);
    } catch (error) {
      console.error("Admin getUserDetails error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async updateUserStatus(req, res) {
    try {
      const userId = Number(req.params.userId);
      const { status } = req.body;

      if (!userId || !status) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      if (!["active", "suspended", "deactivated"].includes(status)) {
        return res.status(400).json({ message: "Invalid status." });
      }

      const user = await AdminService.updateUserStatus(userId, status);
      if (!user) return res.status(404).json({ message: "User not found." });

      await ActivityLogService.log({
        actorUserId: req.user.userId,
        action: "admin.user.status_update",
        entityType: "user",
        entityId: userId,
        metadata: { status },
      });

      res.status(200).json({ message: "User updated.", user });
    } catch (error) {
      console.error("Admin updateUserStatus error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async listOrganizations(req, res) {
    try {
      const { search, verificationStatus, limit, offset } = req.query;
      const parsedLimit = Number(limit ?? 10);
      const parsedOffset = Number(offset ?? 0);
      const safeLimit = Number.isFinite(parsedLimit)
        ? Math.min(Math.max(parsedLimit, 1), 50)
        : 10;
      const safeOffset = Number.isFinite(parsedOffset) ? Math.max(parsedOffset, 0) : 0;

      const data = await AdminService.listOrganizations({
        search,
        verificationStatus,
        limit: safeLimit,
        offset: safeOffset,
      });

      res.status(200).json(data);
    } catch (error) {
      console.error("Admin listOrganizations error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async getOrganizationDetails(req, res) {
    try {
      const organizationId = Number(req.params.organizationId);
      if (!organizationId) {
        return res.status(400).json({ message: "Invalid organization id." });
      }

      const data = await AdminService.getOrganizationDetails(organizationId);
      if (!data) return res.status(404).json({ message: "Organization not found." });

      res.status(200).json(data);
    } catch (error) {
      console.error("Admin getOrganizationDetails error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async listAllOpportunities(req, res) {
    try {
      const { limit, offset } = req.query;
      const parsedLimit = Number(limit ?? 10);
      const parsedOffset = Number(offset ?? 0);
      const safeLimit = Number.isFinite(parsedLimit)
        ? Math.min(Math.max(parsedLimit, 1), 50)
        : 10;
      const safeOffset = Number.isFinite(parsedOffset) ? Math.max(parsedOffset, 0) : 0;

      const data = await AdminService.listAllOpportunities({
        limit: safeLimit,
        offset: safeOffset,
      });

      res.status(200).json(data);
    } catch (error) {
      console.error("Admin listAllOpportunities error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async listActivityLogs(req, res) {
    try {
      const { action, actorUserId, limit, offset } = req.query;
      const parsedLimit = Number(limit ?? 20);
      const parsedOffset = Number(offset ?? 0);
      const safeLimit = Number.isFinite(parsedLimit)
        ? Math.min(Math.max(parsedLimit, 1), 100)
        : 20;
      const safeOffset = Number.isFinite(parsedOffset) ? Math.max(parsedOffset, 0) : 0;
      const parsedActorUserId = actorUserId ? Number(actorUserId) : undefined;

      const data = await ActivityLogService.list({
        action: action ? String(action) : undefined,
        actorUserId: Number.isFinite(parsedActorUserId) ? parsedActorUserId : undefined,
        limit: safeLimit,
        offset: safeOffset,
      });

      res.status(200).json(data);
    } catch (error) {
      console.error("Admin listActivityLogs error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};
