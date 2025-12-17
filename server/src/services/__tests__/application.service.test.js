import { jest } from '@jest/globals';

// Mocking Application model
jest.unstable_mockModule('../../models/application.model.js', () => ({
  default: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
}));

// Mocking Opportunity model
jest.unstable_mockModule('../../models/opportunity.model.js', () => ({
  default: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
  },
}));

// Mocking Volunteer model
jest.unstable_mockModule('../../models/volunteer.model.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

// Mocking Organization model
jest.unstable_mockModule('../../models/organization.model.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

// Mocking Sequelize
jest.unstable_mockModule('../../models/user.model.js', () => ({
  default: {},
}));


// Importing the ApplicationService and mocked models
const { ApplicationService } = await import('../application.service.js');
const { default: Application } = await import('../../models/application.model.js');
const { default: Opportunity } = await import('../../models/opportunity.model.js');
const { default: Volunteer } = await import('../../models/volunteer.model.js');
const { default: Organization } = await import('../../models/organization.model.js');


describe('ApplicationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Tests for volunteer not found 
  test('should return error if volunteer is not found', async () => {
    Volunteer.findOne.mockResolvedValue(null);

    const result = await ApplicationService.apply(1, 10);

    expect(result).toEqual({ error: 'Volunteer not found' });
  });

  // tests for opportunity not found
  test('should return error if opportunity is not found', async () => {
    Volunteer.findOne.mockResolvedValue({ volunteerId: 5 });
    Opportunity.findByPk.mockResolvedValue(null);

    const result = await ApplicationService.apply(1, 10);

    expect(result).toEqual({ error: 'Opportunity not found.' });
  });

  // test for application already exists
  test('should return error if application already exists', async () => {
    Volunteer.findOne.mockResolvedValue({ volunteerId: 5 });
    Opportunity.findByPk.mockResolvedValue({ id: 10 });
    Application.findOne.mockResolvedValue({ id: 99 });

    const result = await ApplicationService.apply(1, 10);

    expect(result).toEqual({
      error: 'You have already applied to this opportunity.',
    });
  });

  // test for successful application creation
  test('should create and return a new application', async () => {
    Volunteer.findOne.mockResolvedValue({ volunteerId: 5 });
    Opportunity.findByPk.mockResolvedValue({ id: 10 });
    Application.findOne.mockResolvedValue(null);

    const mockApplication = {
      id: 1,
      volunteerId: 5,
      opportunityId: 10,
      status: 'pending',
    };

    Application.create.mockResolvedValue(mockApplication);

    const result = await ApplicationService.apply(1, 10);

    expect(Application.create).toHaveBeenCalledWith({
      volunteerId: 5,
      opportunityId: 10,
      status: 'pending',
    });
    expect(result).toBe(mockApplication);
  });


  // test for getMyApplications - volunteer not found
  test('should return empty array if volunteer is not found', async () => {
    Volunteer.findOne.mockResolvedValue(null);

    const result = await ApplicationService.getMyApplications(1);

    expect(result).toEqual([]);
  });


  // test for getMyApplications - successful retrieval
  test('should return applications for the volunteer', async () => {
    Volunteer.findOne.mockResolvedValue({ volunteerId: 5 });

    const mockApplications = [
      { id: 1, status: 'pending' },
      { id: 2, status: 'accepted' },
    ];

    Application.findAll.mockResolvedValue(mockApplications);

    const result = await ApplicationService.getMyApplications(1);

    expect(Application.findAll).toHaveBeenCalled();
    expect(result).toBe(mockApplications);
  });

  // test listByOpportunity - organization not found
  test('should throw error if organization is not found', async () => {
    Organization.findOne.mockResolvedValue(null);

    await expect(
      ApplicationService.listByOpportunity(1, 10)
    ).rejects.toThrow('Organization not found');
  });

  // test listByOpportunity - opportunity not owned by organization
  test('should return empty array if organization does not own opportunity', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });
    Opportunity.findOne.mockResolvedValue(null);

    const result = await ApplicationService.listByOpportunity(1, 10);

    expect(result).toEqual([]);
  });

  // test listByOpportunity - successful retrieval
  test('should return applications if organization owns opportunity', async () => {
    Organization.findOne.mockResolvedValue({ organizationId: 1 });
    Opportunity.findOne.mockResolvedValue({ opportunityId: 10 });

    const mockApplications = [{ id: 1 }, { id: 2 }];
    Application.findAll.mockResolvedValue(mockApplications);

    const result = await ApplicationService.listByOpportunity(10, 1);

    expect(result).toBe(mockApplications);
  });

  // test reviewForOrganization - invalid decision
  test('should throw error if decision is invalid', async () => {
    await expect(
      ApplicationService.reviewForOrganization(1, 'maybe', 10)
    ).rejects.toThrow('Invalid decision');
  });

  // test reviewForOrganization - application not found or unauthorized
  test('should throw error if application is not found or unauthorized', async () => {
    Application.findByPk.mockResolvedValue(null);

    await expect(
      ApplicationService.reviewForOrganization(1, 'accepted', 10)
    ).rejects.toThrow('Unauthorized or application not found');
  });

  // test reviewForOrganization - application already reviewed
  test('should throw error if application already reviewed', async () => {
    Application.findByPk.mockResolvedValue({
      status: 'accepted',
    });

    await expect(
      ApplicationService.reviewForOrganization(1, 'rejected', 10)
    ).rejects.toThrow('Application already accepted. Review is final.');
  });

  // test reviewForOrganization - successful update
  test('should update application status when valid', async () => {
    const mockApplication = {
      status: 'pending',
      save: jest.fn(),
    };

    Application.findByPk.mockResolvedValue(mockApplication);

    const result = await ApplicationService.reviewForOrganization(
      1,
      'accepted',
      10
    );

    expect(mockApplication.status).toBe('accepted');
    expect(mockApplication.save).toHaveBeenCalled();
    expect(result).toBe(mockApplication);
  });

  // tests update for application not found
  test('should return error if application not found', async () => {
    Application.findByPk.mockResolvedValue(null);

    const result = await ApplicationService.update(1, { status: 'accepted' });

    expect(result).toEqual({ error: 'Application not found.' });
  });

  // tests update for application update
  test('should update and return application', async () => {
    const mockApplication = {
      status: 'pending',
      save: jest.fn(),
    };

    Application.findByPk.mockResolvedValue(mockApplication);

    const result = await ApplicationService.update(1, { status: 'accepted' });

    expect(mockApplication.status).toBe('accepted');
    expect(mockApplication.save).toHaveBeenCalled();
    expect(result).toBe(mockApplication);
  });
});
