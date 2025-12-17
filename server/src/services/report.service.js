import Opportunity from "../models/opportunity.model.js";
import Report from "../models/report.model.js";
import Volunteer from "../models/volunteer.model.js";

export const ReportService = {
  async createReport(userId, opportunityId, content) {
    const volunteer = await Volunteer.findOne({ where: { userId } });
    if (!volunteer) return { error: "Volunteer not found." };

    const opportunity = await Opportunity.findByPk(opportunityId);
    if (!opportunity) return { error: "Opportunity not found." };

    const report = await Report.create({
      volunteerId: volunteer.volunteerId,
      opportunityId,
      content,
    });

    return report;
  },
};
