import Opportunity from "../models/opportunity.model.js";
import Category from "../models/category.model.js";
import Organization from "../models/organization.model.js";
import { Op } from "sequelize";

export const OpportunityService = {
  async getAllOpportunities(filters) {
    const where = {};

    // Apply filters

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.location) {
      where.location = filters.location;
    }

    if (filters.search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${filters.search}%` } },
        { description: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    return Opportunity.findAll({
      where,
      include: [
        { model: Category, as: "category" },
        { model: Organization, as: "organization" },
      ],
    });
  },

  getOpportunityById(id) {
    return Opportunity.findByPk(id, {
      include: [
        { model: Category, as: "category" },
        { model: Organization, as: "organization" },
      ],
    });
  },

  async getOrganizationIdByUserId(userId) {
    const organization = await Organization.findOne({
      where: { userId },
    });
    if (!organization) {
      throw new Error("Organization not found for this user");
    }
    return organization.organizationId;
  },

  async createOpportunity(opportunityData, userId) {
    // 1️⃣ Get organizationId from authenticated user
    const organizationId = await this.getOrganizationIdByUserId(userId);

    // 2️⃣ Base required fields
    const cleanedData = {
      title: opportunityData.title.trim(),
      description: opportunityData.description.trim(),
      organizationId,
    };

    // 3️⃣ Optional fields (validated)

    if (opportunityData.location?.trim()) {
      cleanedData.location = opportunityData.location.trim();
    }

    if (opportunityData.date) {
      const parsedDate = new Date(opportunityData.date);
      if (isNaN(parsedDate)) {
        throw new Error("Invalid date");
      }
      cleanedData.date = parsedDate;
    }

    if (opportunityData.categoryId) {
      const category = await Category.findByPk(opportunityData.categoryId);
      if (!category) {
        throw new Error("Invalid category");
      }
      cleanedData.categoryId = opportunityData.categoryId;
    }

    // 4️⃣ Create opportunity
    const opportunity = await Opportunity.create(cleanedData);

    // 5️⃣ Return opportunity with relations
    return Opportunity.findByPk(opportunity.opportunityId, {
      include: [
        { model: Category, as: "category" },
        { model: Organization, as: "organization" },
      ],
    });
  },

  async getAllOpportunitiesByOrganization(userId) {
    const organizationId = await this.getOrganizationIdByUserId(userId);

    return Opportunity.findAll({
      where: { organizationId },
      include: [
        { model: Category, as: "category" },
        { model: Organization, as: "organization" },
      ],
      order: [["createdAt", "DESC"]],
    });
  },

  async updateOpportunity(opportunityId, opportunityData, userId) {
    // Step 1: Get organizationId from userId
    const organizationId = await this.getOrganizationIdByUserId(userId);

    // Step 2: Find the opportunity and verify ownership
    const opportunity = await Opportunity.findByPk(opportunityId);
    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    // Step 3: Verify the opportunity belongs to this organization
    if (opportunity.organizationId !== organizationId) {
      throw new Error("You do not have permission to update this opportunity");
    }

    // Step 4: Update the opportunity
    await opportunity.update(opportunityData);

    // Step 5: Return updated opportunity with associations
    return Opportunity.findByPk(opportunityId, {
      include: [
        { model: Category, as: "category" },
        { model: Organization, as: "organization" },
      ],
    });
  },

  async deleteOpportunity(opportunityId, userId) {
    // Step 1: Get organizationId from userId
    const organizationId = await this.getOrganizationIdByUserId(userId);

    // Step 2: Find the opportunity and verify ownership
    const opportunity = await Opportunity.findByPk(opportunityId);
    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    // Step 3: Verify the opportunity belongs to this organization
    if (opportunity.organizationId !== organizationId) {
      throw new Error("You do not have permission to delete this opportunity");
    }

    // Step 4: Delete the opportunity
    await opportunity.destroy();

    return { message: "Opportunity deleted successfully" };
  },
};
