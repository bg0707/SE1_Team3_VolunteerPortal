import { ReportService } from "../services/report.service.js";
import { ActivityLogService } from "../services/activityLog.service.js";

export const ReportController = {
  async create(req, res) {
    try {
      const userId = req.user.userId;
      const { opportunityId, content } = req.body;

      if (!opportunityId || !content) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const result = await ReportService.createReport(userId, Number(opportunityId), String(content));

      if (result?.error) {
        return res.status(400).json({ message: result.error });
      }

      await ActivityLogService.log({
        actorUserId: userId,
        action: "report.create",
        entityType: "report",
        entityId: result?.reportId,
        metadata: {
          opportunityId: Number(opportunityId),
        },
      });

      return res.status(201).json({ message: "Report submitted.", report: result });
    } catch (error) {
      console.error("Create report error:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};
