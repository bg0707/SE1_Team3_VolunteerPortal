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
};