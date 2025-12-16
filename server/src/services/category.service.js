import Category from "../models/category.model.js";

export const CategoryService = {
  async getAllCategories() {
    return Category.findAll({
      order: [["name", "ASC"]],
    });
  },
};
