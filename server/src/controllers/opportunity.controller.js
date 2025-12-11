import { OpportunityService } from '../services/opportunity.service.js';

export const OpportunityController = {
    // GET /opportunities
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

    // GET /opportunities/:id
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
    },

    // POST /opportunities
    async create(req, res) {
        try {
            // Step 1: Get authenticated user info (set by authenticateUser middleware)
            const userId = req.user.userId;

            // Step 2: Get opportunity data from request body
            const { title, description, location, date, categoryId } = req.body;

            // Step 3: Validate required fields
            if (!title || !title.trim()) {
                return res.status(400).json({
                    message: 'Title is required' 
                });
            }
            if (!description || !description.trim()) {
                return res.status(400).json({
                    message: 'Description is required' 
                });
            }

            // Step 4: Call service to create opportunity
            // The service will automatically set organizationId from userId
            const opportunity = await OpportunityService.createOpportunity(
                { title, description, location, date, categoryId },
                userId
            );

            // Step 5: Return success response with created opportunity
            res.status(201).json({
                message: 'Opportunity created successfully',
                opportunity
            });
        } catch (error) {
            console.error("Error creating opportunity:", error);
            console.error("Error stack:", error.stack);
            res.status(500).json({
                message: 'Error creating opportunity',
                error: error.message
            });
        }
    },

    // GET /opportunities/my-opportunities
    async getMyOpportunities(req, res) {
        try {
            const userId = req.user.userId;
            const opportunities = await OpportunityService.getAllOpportunitiesByOrganization(userId);
            res.status(200).json(opportunities);
        } catch (error) {
            console.error("Error fetching my opportunities:", error);
            res.status(500).json({
                message: 'Error fetching opportunities',
                error: error.message
            });
        }
    },

    // PUT /opportunities/:id
    async update(req, res) {
        try {
            const opportunityId = req.params.id;
            const userId = req.user.userId;
            const { title, description, location, date, categoryId } = req.body;

            // Validate required fields
            if (!title || !description) {
                return res.status(400).json({
                    message: 'Title and description are required'
                });
            }

            const opportunity = await OpportunityService.updateOpportunity(
                opportunityId,
                { title, description, location, date, categoryId },
                userId
            );

            res.status(200).json({
                message: 'Opportunity updated successfully',
                opportunity
            });
        } catch (error) {
            console.error("Error updating opportunity:", error);

            // Handle specific error cases
            if (error.message === 'Opportunity not found') {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('permission')) {
                return res.status(403).json({ message: error.message });
            }

            res.status(500).json({
                message: 'Error updating opportunity',
                error: error.message
            });
        }
    },

    // DELETE /opportunities/:id
    async delete(req, res) {
        try {
            const opportunityId = req.params.id;
            const userId = req.user.userId;

            await OpportunityService.deleteOpportunity(opportunityId, userId);

            res.status(200).json({
                message: 'Opportunity deleted successfully'
            });
        } catch (error) {
            console.error("Error deleting opportunity:", error);

            // Handle specific error cases
            if (error.message === 'Opportunity not found') {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('permission')) {
                return res.status(403).json({ message: error.message });
            }

            res.status(500).json({
                message: 'Error deleting opportunity',
                error: error.message
            });
        }
    }
};