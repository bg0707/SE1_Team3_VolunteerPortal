import Opportunity from '../models/opportunity.model.js';
import Category from '../models/category.model.js';
import Organization from '../models/organization.model.js';
import { Op } from 'sequelize';

export const OpportunityService = {
    async getAllOpportunities(filters) {
        const where = {};

        // Apply filters

        if(filters.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if(filters.location) { 
            where.location = filters.location;
        }

        if(filters.search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${filters.search}%`} },
                { description: { [Op.like]: `%${filters.search}%`} },
            ];
        }

        return Opportunity.findAll({
            where, 
            include: [
                {model: Category, as: "category"},
                {model: Organization, as: "organization"},
            ],
        });
            
    },

    getOpportunityById(id) {
        return Opportunity.findByPk(id, {
            include: [
                {model: Category, as: "category"},
                {model: Organization, as: "organization"},
            ],
        });
    },

    async getOrganizationIdByUserId(userId) {
        const organization = await Organization.findOne({
            where: { userId },
        });
        if (!organization) {
            throw new Error('Organization not found for this user');
        }
        return organization.organizationId;
    },

    async createOpportunity(opportunityData, userId) {
        try {
            // Step 1: Get organizationId from userId
            const organizationId = await this.getOrganizationIdByUserId(userId);

            // Step 2: Clean up data - remove empty strings, keep only valid values
            const cleanedData = {
                title: opportunityData.title,
                description: opportunityData.description,
                organizationId,
            };

            // Only include optional fields if they have values
            if (opportunityData.location && opportunityData.location.trim()) {
                cleanedData.location = opportunityData.location.trim();
            }
            if (opportunityData.date && opportunityData.date.trim()) {
                cleanedData.date = opportunityData.date;
            }
            if (opportunityData.categoryId) {
                cleanedData.categoryId = opportunityData.categoryId;
            }

            // Step 3: Create the opportunity in database
            const opportunity = await Opportunity.create(cleanedData);

            // Step 4: Return the created opportunity with associations (category, organization)
            return Opportunity.findByPk(opportunity.opportunityId, {
                include: [
                    {model: Category, as: "category"},
                    {model: Organization, as: "organization"},
                ],
            });
        } catch (error) {
            console.error("Error in createOpportunity service:", error);
            throw error;
        }
    },

    async getAllOpportunitiesByOrganization(userId) {
        const organizationId = await this.getOrganizationIdByUserId(userId);

        return Opportunity.findAll({
            where: { organizationId },
            include: [
                {model: Category, as: "category"},
                {model: Organization, as: "organization"},
            ],
            order: [['createdAt', 'DESC']],
        });
    },

    async updateOpportunity(opportunityId, opportunityData, userId) {
        // Step 1: Get organizationId from userId
        const organizationId = await this.getOrganizationIdByUserId(userId);

        // Step 2: Find the opportunity and verify ownership
        const opportunity = await Opportunity.findByPk(opportunityId);
        if (!opportunity) {
            throw new Error('Opportunity not found');
        }

        // Step 3: Verify the opportunity belongs to this organization
        if (opportunity.organizationId !== organizationId) {
            throw new Error('You do not have permission to update this opportunity');
        }

        // Step 4: Update the opportunity
        await opportunity.update(opportunityData);

        // Step 5: Return updated opportunity with associations
        return Opportunity.findByPk(opportunityId, {
            include: [
                {model: Category, as: "category"},
                {model: Organization, as: "organization"},
            ],
        });
    },

    async deleteOpportunity(opportunityId, userId) {
        // Step 1: Get organizationId from userId
        const organizationId = await this.getOrganizationIdByUserId(userId);

        // Step 2: Find the opportunity and verify ownership
        const opportunity = await Opportunity.findByPk(opportunityId);
        if (!opportunity) {
            throw new Error('Opportunity not found');
        }

        // Step 3: Verify the opportunity belongs to this organization
        if (opportunity.organizationId !== organizationId) {
            throw new Error('You do not have permission to delete this opportunity');
        }

        // Step 4: Delete the opportunity
        await opportunity.destroy();

        return { message: 'Opportunity deleted successfully' };
    },
};