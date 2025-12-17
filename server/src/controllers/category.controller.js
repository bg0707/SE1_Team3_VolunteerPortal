// controllers/category.controller.js
import { CategoryService } from '../services/category.service.js';

export const CategoryController = {
  async getAll(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories' });
    }
  }
};
