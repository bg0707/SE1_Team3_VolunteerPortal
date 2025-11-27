import express from 'express';
import { OpportunityController } from '../controllers/opportunity.controller.js';

const router = express.Router();

// GET /opportunities - with filters 
router.get('/', OpportunityController.getAll);

// GET /opportunities/:id - get by ID
router.get('/:id', OpportunityController.getById);

export default router;