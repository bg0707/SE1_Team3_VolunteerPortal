import { jest } from '@jest/globals';

// Mocking database and models
jest.unstable_mockModule('../../config/db.js', () => ({
  default: {
    transaction: jest.fn((callback) => callback({})),
  },
}));

// Mocking models
jest.unstable_mockModule('../../models/report.model.js', () => ({
  default: {
    findAll: jest.fn(),
    destroy: jest.fn(),
  },
}));

// Mocking Opportunity model
jest.unstable_mockModule('../../models/opportunity.model.js', () => ({
  default: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
  },
}));

// Mocking Application model
jest.unstable_mockModule('../../models/application.model.js', () => ({
  default: {
    destroy: jest.fn(),
  },
}));

// Mocking Organization model
jest.unstable_mockModule('../../models/organization.model.js', () => ({
  default: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
  },
}));

// Mocking User model
jest.unstable_mockModule('../../models/user.model.js', () => ({
  default: {
    destroy: jest.fn(),
  },
}));

// Mocking Volunteer model
jest.unstable_mockModule('../../models/volunteer.model.js', () => ({
  default: {},
}));

// Importing the AdminService and mocked models
const { AdminService } = await import('../admin.service.js');
const { default: Report } = await import('../../models/report.model.js');
const { default: Opportunity } = await import('../../models/opportunity.model.js');
const { default: Application } = await import('../../models/application.model.js');
const { default: Organization } = await import('../../models/organization.model.js');
const { default: User } = await import('../../models/user.model.js');


describe('AdminService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Tests for getReportedOpportunities
  test('should group reports by opportunity', async () => {
    const mockReports = [
      {
        opportunity: { opportunityId: 1, title: 'Opp 1' },
      },
      {
        opportunity: { opportunityId: 1, title: 'Opp 1' },
      },
      {
        opportunity: { opportunityId: 2, title: 'Opp 2' },
      },
    ];

    Report.findAll.mockResolvedValue(mockReports);

    const result = await AdminService.getReportedOpportunities();

    expect(result).toHaveLength(2);
    expect(result[0].reportCount).toBe(2);
    expect(result[1].reportCount).toBe(1);
  });

  // Tests for if an opportunity does not exist
  test('should return error if opportunity does not exist', async () => {
    Opportunity.findByPk.mockResolvedValue(null);

    const result = await AdminService.keepOpportunity(1);

    expect(result).toEqual({ error: 'Opportunity not found.' });
  });

  // Tests for deleting reports but keeping opportunity
  test('should delete reports and keep opportunity', async () => {
    Opportunity.findByPk.mockResolvedValue({ opportunityId: 1 });

    const result = await AdminService.keepOpportunity(1);

    expect(Report.destroy).toHaveBeenCalledWith({
      where: { opportunityId: 1 },
    });
    expect(result).toEqual({ ok: true });
  });

  // tests for opportunity does not exist 
  test('should return error if opportunity does not exist', async () => {
    Opportunity.findByPk.mockResolvedValue(null);

    const result = await AdminService.removeOpportunity(1);

    expect(result).toEqual({ error: 'Opportunity not found.' });
  });

  // tests for deleting opportunity and dependencies
  test('should delete opportunity and all dependencies', async () => {
    Opportunity.findByPk.mockResolvedValue({ opportunityId: 1 });

    const result = await AdminService.removeOpportunity(1);

    expect(Application.destroy).toHaveBeenCalled();
    expect(Report.destroy).toHaveBeenCalled();
    expect(Opportunity.destroy).toHaveBeenCalled();
    expect(result).toEqual({ ok: true });
  });

  // tests for listing unverified organizations
  test('should return unverified organizations', async () => {
    const mockOrgs = [{ id: 1 }, { id: 2 }];
    Organization.findAll.mockResolvedValue(mockOrgs);

    const result = await AdminService.listPendingOrganizations();

    expect(Organization.findAll).toHaveBeenCalled();
    expect(result).toBe(mockOrgs);
  });

  // tests for verifying organization
  test('should return error if organization not found', async () => {
    Organization.findByPk.mockResolvedValue(null);

    const result = await AdminService.verifyOrganization(1);

    expect(result).toEqual({ error: 'Organization not found.' });
  });

  // tests for verifying organization
  test('should verify organization', async () => {
    const mockOrg = {
      isVerified: false,
      save: jest.fn(),
    };

    Organization.findByPk.mockResolvedValue(mockOrg);

    const result = await AdminService.verifyOrganization(1);

    expect(mockOrg.isVerified).toBe(true);
    expect(mockOrg.save).toHaveBeenCalled();
    expect(result.ok).toBe(true);
  });

  // tests for organization not found 
  test('should return error if organization not found', async () => {
    Organization.findByPk.mockResolvedValue(null);

    const result = await AdminService.rejectOrganization(1);

    expect(result).toEqual({ error: 'Organization not found.' });
  });

  // tests for deleting organization and dependencies
  test('should delete organization, user, and opportunities', async () => {
    const mockOrg = { organizationId: 1, userId: 5 };
    const mockOpps = [
      { opportunityId: 10 },
      { opportunityId: 20 },
    ];

    Organization.findByPk.mockResolvedValue(mockOrg);
    Opportunity.findAll.mockResolvedValue(mockOpps);

    const result = await AdminService.rejectOrganization(1);

    expect(Application.destroy).toHaveBeenCalled();
    expect(Report.destroy).toHaveBeenCalled();
    expect(Opportunity.destroy).toHaveBeenCalled();
    expect(Organization.destroy).toHaveBeenCalled();
    expect(User.destroy).toHaveBeenCalled();
    expect(result).toEqual({ ok: true });
  });
});
