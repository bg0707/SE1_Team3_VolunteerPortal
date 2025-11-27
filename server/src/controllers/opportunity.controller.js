import { OpportunityService } from '../services/opportunity.service.js';

export const OpportunityController = {
    async getAll(req, res) {
        try {
            const filters = req.query;
            const opportunities = await OpportunityService.getAllOpportunities(filters);
            res.status(200).json(opportunities);
        } catch (error) {
            console.error("Error fetching opportunities:", error);
            res.status(500).json({ message: 'Error fetching opportunities', error });
        }
    },

    async getById(req, res) {
        try {
            const id = req.params.id;
            const opportunity = await OpportunityService.getOpportunityById(id);
            if (!opportunity) {
                return res.status(404).json({ message: 'Opportunity not found' });
            }

            res.json(opportunity);
        } catch (error) {
            console.error("Error fetching opportunity by ID:", error);
            res.status(500).json({ message: 'Error fetching opportunity', error });
        }
    }
};