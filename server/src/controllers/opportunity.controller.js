import { OpportunityService } from '../services/opportunity.service.js';
import { ActivityLogService } from "../services/activityLog.service.js";

export const OpportunityController = {
  // GET /opportunities
  async getAll(req, res) {
    try {
      const filters = req.query;
      const opportunities = await OpportunityService.getAllOpportunities(filters);
      res.status(200).json(opportunities);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      res.status(500).json({ message: 'Error fetching opportunities' });
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

      res.status(200).json(opportunity);
    } catch (error) {
      console.error("Error fetching opportunity:", error);
      res.status(500).json({ message: 'Error fetching opportunity' });
    }
  },

  // POST /opportunities
  async create(req, res) {
    try {
      const userId = req.user.userId;
      const { title, description, location, date, categoryId } = req.body;
      // File upload middleware sets req.file when an image is provided.
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

      if (!title?.trim()) {
        return res.status(400).json({ message: 'Title is required' });
      }

      if (!description?.trim()) {
        return res.status(400).json({ message: 'Description is required' });
      }

      // Build payload with optional fields only when present.
      const payload = {
        title,
        description,
        location,
        date,
        categoryId,
        ...(imageUrl ? { imageUrl } : {}),
      };

      const opportunity = await OpportunityService.createOpportunity(payload, userId);

      await ActivityLogService.log({
        actorUserId: userId,
        action: "opportunity.create",
        entityType: "opportunity",
        entityId: opportunity?.opportunityId,
        metadata: {
          title: opportunity?.title,
        },
      });

      res.status(201).json({
        message: 'Opportunity created successfully',
        opportunity
      });
    } catch (error) {
      console.error("Error creating opportunity:", error);

      if (
        error.message === 'Invalid category' ||
        error.message === 'Invalid date' ||
        error.message.includes('Organization')
      ) {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({ message: 'Error creating opportunity' });
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
      res.status(500).json({ message: 'Error fetching opportunities' });
    }
  },

  // PUT /opportunities/:id
  async update(req, res) {
    try {
      const opportunityId = req.params.id;
      const userId = req.user.userId;
      const { title, description, location, date, categoryId } = req.body;
      // File upload middleware sets req.file when an image is provided.
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

      if (!title?.trim() || !description?.trim()) {
        return res.status(400).json({
          message: 'Title and description are required'
        });
      }

      // Build payload with optional fields only when present.
      const payload = {
        title,
        description,
        location,
        date,
        categoryId,
        ...(imageUrl ? { imageUrl } : {}),
      };

      const opportunity = await OpportunityService.updateOpportunity(
        opportunityId,
        payload,
        userId
      );

      await ActivityLogService.log({
        actorUserId: userId,
        action: "opportunity.update",
        entityType: "opportunity",
        entityId: opportunity?.opportunityId ?? Number(opportunityId),
        metadata: {
          title: opportunity?.title,
        },
      });

      res.status(200).json({
        message: 'Opportunity updated successfully',
        opportunity
      });
    } catch (error) {
      console.error("Error updating opportunity:", error);

      if (error.message === 'Opportunity not found') {
        return res.status(404).json({ message: error.message });
      }

      if (error.message.includes('permission')) {
        return res.status(403).json({ message: error.message });
      }

      if (
        error.message === 'Invalid category' ||
        error.message === 'Invalid date'
      ) {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({ message: 'Error updating opportunity' });
    }
  },

  // DELETE /opportunities/:id
  async delete(req, res) {
    try {
      const opportunityId = req.params.id;
      const userId = req.user.userId;

      await OpportunityService.deleteOpportunity(opportunityId, userId);

      await ActivityLogService.log({
        actorUserId: userId,
        action: "opportunity.delete",
        entityType: "opportunity",
        entityId: Number(opportunityId),
      });

      res.status(200).json({ message: 'Opportunity deleted successfully' });
    } catch (error) {
      console.error("Error deleting opportunity:", error);

      if (error.message === 'Opportunity not found') {
        return res.status(404).json({ message: error.message });
      }

      if (error.message.includes('permission')) {
        return res.status(403).json({ message: error.message });
      }

      res.status(500).json({ message: 'Error deleting opportunity' });
    }
  }
};
