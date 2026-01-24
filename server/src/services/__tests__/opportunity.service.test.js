import { jest } from '@jest/globals';
import { Op } from 'sequelize';

jest.unstable_mockModule('../../models/opportunity.model.js', () => ({
  default: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('../../models/category.model.js', () => ({
  default: {
    findByPk: jest.fn(),
  },
}));

jest.unstable_mockModule('../../models/organization.model.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

const { OpportunityService } = await import('../opportunity.service.js');
const { default: Opportunity } = await import('../../models/opportunity.model.js');
const { default: Category } = await import('../../models/category.model.js');
const { default: Organization } = await import('../../models/organization.model.js');

describe('OpportunityService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllOpportunities applies active status and filters', async () => {
    Opportunity.findAll.mockResolvedValue([]);

    await OpportunityService.getAllOpportunities({
      categoryId: 3,
      location: 'Luxembourg',
      search: 'help',
    });

    expect(Opportunity.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: 'active',
          categoryId: 3,
          location: 'Luxembourg',
          [Op.or]: [
            { title: { [Op.like]: '%help%' } },
            { description: { [Op.like]: '%help%' } },
          ],
        },
      })
    );
  });

  test('getAllOpportunities returns all when no filters', async () => {
    const mockOpportunities = [{ id: 1 }, { id: 2 }];
    Opportunity.findAll.mockResolvedValue(mockOpportunities);

    const result = await OpportunityService.getAllOpportunities({});

    expect(result).toBe(mockOpportunities);
  });

  test('getOpportunityById uses active status', async () => {
    const mockOpportunity = { id: 1 };
    Opportunity.findOne.mockResolvedValue(mockOpportunity);

    const result = await OpportunityService.getOpportunityById(1);

    expect(Opportunity.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { opportunityId: 1, status: 'active' },
        include: expect.any(Array),
      })
    );
    expect(result).toBe(mockOpportunity);
  });

  test('getOrganizationIdByUserId returns organizationId', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 42 });

    const result = await OpportunityService.getOrganizationIdByUserId(1);

    expect(result).toBe(42);
  });

  test('getOrganizationIdByUserId throws when organization missing', async () => {
    Organization.findOne.mockResolvedValue(null);

    await expect(
      OpportunityService.getOrganizationIdByUserId(1)
    ).rejects.toThrow('Organization not found for this user');
  });

  test('createOpportunity trims fields and creates opportunity', async () => {
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

    expect(Opportunity.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Help',
        description: 'Description',
        location: 'Brussels',
        organizationId: 1,
        categoryId: 3,
      })
    );
    expect(result).toEqual({ id: 10 });
  });

  test('createOpportunity throws on invalid date', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });

    await expect(
      OpportunityService.createOpportunity(
        { title: 'T', description: 'D', date: 'not-a-date' },
        1
      )
    ).rejects.toThrow('Invalid date');
  });

  test('createOpportunity throws on invalid category', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });
    Category.findByPk.mockResolvedValue(null);

    await expect(
      OpportunityService.createOpportunity(
        { title: 'T', description: 'D', categoryId: 99 },
        1
      )
    ).rejects.toThrow('Invalid category');
  });

  test('getAllOpportunitiesByOrganization uses organizationId', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 5 });
    Opportunity.findAll.mockResolvedValue([]);

    await OpportunityService.getAllOpportunitiesByOrganization(2);

    expect(Opportunity.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { organizationId: 5 } })
    );
  });

  test('updateOpportunity throws when opportunity missing', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });
    Opportunity.findByPk.mockResolvedValue(null);

    await expect(
      OpportunityService.updateOpportunity(10, {}, 1)
    ).rejects.toThrow('Opportunity not found');
  });

  test('updateOpportunity throws when not owner', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });
    Opportunity.findByPk.mockResolvedValue({ organizationId: 2 });

    await expect(
      OpportunityService.updateOpportunity(10, {}, 1)
    ).rejects.toThrow('You do not have permission to update this opportunity');
  });

  test('updateOpportunity strips status and updates', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });
    const mockOpp = {
      organizationId: 1,
      update: jest.fn(),
    };
    Opportunity.findByPk.mockResolvedValueOnce(mockOpp).mockResolvedValueOnce({ id: 10 });

    const result = await OpportunityService.updateOpportunity(
      10,
      { title: 'New', status: 'suspended' },
      1
    );

    expect(mockOpp.update).toHaveBeenCalledWith({ title: 'New' });
    expect(result).toEqual({ id: 10 });
  });

  test('deleteOpportunity throws when opportunity missing', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });
    Opportunity.findByPk.mockResolvedValue(null);

    await expect(
      OpportunityService.deleteOpportunity(10, 1)
    ).rejects.toThrow('Opportunity not found');
  });

  test('deleteOpportunity throws when not owner', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });
    Opportunity.findByPk.mockResolvedValue({ organizationId: 2 });

    await expect(
      OpportunityService.deleteOpportunity(10, 1)
    ).rejects.toThrow('You do not have permission to delete this opportunity');
  });

  test('deleteOpportunity deletes when owner', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });
    Opportunity.findByPk.mockResolvedValue({
      organizationId: 1,
      destroy: jest.fn(),
    });

    const result = await OpportunityService.deleteOpportunity(10, 1);

    expect(result).toEqual({ message: 'Opportunity deleted successfully' });
  });
});
