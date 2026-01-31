import express from 'express';
import { OpportunityController } from '../controllers/opportunity.controller.js';
import { authenticateUser } from '../middleware/authenticateUser.js';
import { requireOrganization } from '../middleware/requireOrganization.js';
import upload from '../middleware/uploadOpportunityImage.js';

const router = express.Router();

// GET /opportunities - with filters (Public, no authentication required)
router.get('/', OpportunityController.getAll);

// GET /opportunities/my-opportunities - Get all opportunities for authenticated organization
// IMPORTANT: This must come BEFORE /:id route to avoid route conflicts
router.get(
    '/my-opportunities',
    authenticateUser,
    requireOrganization,
    OpportunityController.getMyOpportunities
);

// GET /opportunities/:id - get by ID (Public, no authentication required)
// This must come AFTER /my-opportunities to avoid matching "my-opportunities" as an ID
router.get('/:id', OpportunityController.getById);

// POST /opportunities - Create new opportunity (Requires authentication + organization role)
// Middleware chain: authenticateUser -> requireOrganization -> create controller
router.post(
    '/',
    authenticateUser, // Step 1: Verify JWT token, set req.user
    requireOrganization, // Step 2: Verify user role is "organization"
    upload.single('image'),
    OpportunityController.create // Step 3: Handle the create request
);

// PUT /opportunities/:id - Update an opportunity (Requires authentication + organization role + ownership)
router.put(
    '/:id',
    authenticateUser,
    requireOrganization,
    upload.single('image'),
    OpportunityController.update
);

// DELETE /opportunities/:id - Delete an opportunity (Requires authentication + organization role + ownership)
router.delete(
    '/:id',
    authenticateUser,
    requireOrganization,
    OpportunityController.delete
);

export default router;
