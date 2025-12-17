import { jest } from '@jest/globals';

// Mocking Category model
jest.unstable_mockModule('../../models/category.model.js', () => ({
  default: {
    findAll: jest.fn(),
  },
}));

const { CategoryService } = await import('../category.service.js');
const { default: Category } = await import('../../models/category.model.js');


describe('CategoryService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return all categories ordered by name ascending', async () => {
    // Arrange
    const mockCategories = [
      { id: 1, name: 'Education' },
      { id: 2, name: 'Health' },
    ];

    Category.findAll.mockResolvedValue(mockCategories);

    // Act
    const result = await CategoryService.getAllCategories();

    // Assert
    expect(Category.findAll).toHaveBeenCalledWith({
      order: [['name', 'ASC']],
    });
    expect(result).toBe(mockCategories);
  });
});
