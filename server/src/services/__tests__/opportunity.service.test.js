import { jest } from '@jest/globals';
import { Op } from 'sequelize';

// Mocking Opportunity model
jest.unstable_mockModule('../../models/opportunity.model.js', () => ({
  default: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
}));


// Mocking Category model
jest.unstable_mockModule('../../models/category.model.js', () => ({
  default: {
    findByPk: jest.fn(),
  },
}));


// Mocking Organization model
jest.unstable_mockModule('../../models/organization.model.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

// Importing the OpportunityService and mocked models
const { OpportunityService } = await import('../opportunity.service.js');
const { default: Opportunity } = await import('../../models/opportunity.model.js');
const { default: Category } = await import('../../models/category.model.js');
const { default: Organization } = await import('../../models/organization.model.js');


describe('OpportunityService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // test getAllOpportunities no filters
  test('should return all opportunities when no filters are provided', async () => {
    const mockOpportunities = [{ id: 1 }, { id: 2 }];
    Opportunity.findAll.mockResolvedValue(mockOpportunities);

    const result = await OpportunityService.getAllOpportunities({});

    expect(Opportunity.findAll).toHaveBeenCalled();
    expect(result).toBe(mockOpportunities);
  });

  // test getAllOpportunities with category filter
  test('should apply category filter', async () => {
    Opportunity.findAll.mockResolvedValue([]);

    await OpportunityService.getAllOpportunities({ categoryId: 3 });

    expect(Opportunity.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { categoryId: 3 },
      })
    );
  });

  // test getAllOpportunities with search filter
  test('should apply search filter on title and description', async () => {
    Opportunity.findAll.mockResolvedValue([]);

    await OpportunityService.getAllOpportunities({ search: 'help' });

    expect(Opportunity.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          [Op.or]: [
            { title: { [Op.like]: '%help%' } },
            { description: { [Op.like]: '%help%' } },
          ],
        },
      })
    );
  });

  // test getAllOpportunities no results
  test('should return empty array when no opportunities are found', async () => {
    Opportunity.findAll.mockResolvedValue([]);

    const result = await OpportunityService.getAllOpportunities({});

    expect(result).toEqual([]);
  });

  // test getOpportunityById - successful retrieval
  test('should return opportunity by id', async () => {
    const mockOpportunity = { id: 1 };
    Opportunity.findByPk.mockResolvedValue(mockOpportunity);

    const result = await OpportunityService.getOpportunityById(1);

    expect(Opportunity.findByPk).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        include: expect.any(Array),
      })
    );
    expect(result).toBe(mockOpportunity);
  });

  // test getOpportunityById - opportunity not found
  test('should return null if opportunity does not exist', async () => {
    Opportunity.findByPk.mockResolvedValue(null);

    const result = await OpportunityService.getOpportunityById(999);

    expect(result).toBeNull();
  });

  // test getOrganizationIdByUserId - successful retrieval
  test('should return organizationId if organization exists', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 42 });

    const result = await OpportunityService.getOrganizationIdByUserId(1);

    expect(result).toBe(42);
  });

  // test getOrganizationIdByUserId - organization not found
  test('should throw error if organization does not exist', async () => {
    Organization.findOne.mockResolvedValue(null);

    await expect(
      OpportunityService.getOrganizationIdByUserId(1)
    ).rejects.toThrow('Organization not found for this user');
  });

  // test createOpportunity - successful creation
  test('should create and return opportunity when data is valid', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });
    Category.findByPk.mockResolvedValue({ categoryId: 3 });

    Opportunity.create.mockResolvedValue({ opportunityId: 10 });
    Opportunity.findByPk.mockResolvedValue({ id: 10 });

    const data = {
      title: ' Help ',
      description: ' Description ',
      categoryId: 3,
      location: ' Brussels ',
    };

    const result = await OpportunityService.createOpportunity(data, 1);

    expect(Opportunity.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 10 });
  });


  // test createOpportunity - invalid category
  test('should throw error if category is invalid', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });
    Category.findByPk.mockResolvedValue(null);

    const data = {
      title: 'Test',
      description: 'Test',
      categoryId: 99,
    };

    await expect(
      OpportunityService.createOpportunity(data, 1)
    ).rejects.toThrow('Invalid category');
  });


  // test updateOpportunity - does not exist
  test('should throw error if opportunity does not exist', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });
    Opportunity.findByPk.mockResolvedValue(null);

    await expect(
      OpportunityService.updateOpportunity(10, {}, 1)
    ).rejects.toThrow('Opportunity not found');
  });

  // test updateOpportunity - user does not own opportunity
  test('should throw error if user does not own opportunity', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });
    Opportunity.findByPk.mockResolvedValue({ organizationId: 2 });

    await expect(
      OpportunityService.updateOpportunity(10, {}, 1)
    ).rejects.toThrow('You do not have permission to update this opportunity');
  });

  // test delete Opportunity - user does own opportunity
  test('should delete opportunity if user owns it', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });
    Opportunity.findByPk.mockResolvedValue({
      organizationId: 1,
      destroy: jest.fn(),
    });

    const result = await OpportunityService.deleteOpportunity(10, 1);

    expect(result).toEqual({
      message: 'Opportunity deleted successfully',
    });
  });
});
