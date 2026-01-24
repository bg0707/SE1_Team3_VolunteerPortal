import { jest } from '@jest/globals';
import { Op } from 'sequelize';

jest.unstable_mockModule('../../config/db.js', () => ({
  default: {
    transaction: jest.fn((callback) => callback({})),
  },
}));

jest.unstable_mockModule('../../models/report.model.js', () => ({
  default: {
    findAll: jest.fn(),
    destroy: jest.fn(),
  },
}));

jest.unstable_mockModule('../../models/opportunity.model.js', () => ({
  default: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
  },
}));

jest.unstable_mockModule('../../models/application.model.js', () => ({
  default: {
    destroy: jest.fn(),
    count: jest.fn(),
  },
}));

jest.unstable_mockModule('../../models/organization.model.js', () => ({
  default: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../../models/user.model.js', () => ({
  default: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.unstable_mockModule('../../models/volunteer.model.js', () => ({
  default: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('../../models/notification.model.js', () => ({
  default: {
    create: jest.fn(),
  },
}));

const { AdminService } = await import('../admin.service.js');
const { default: Report } = await import('../../models/report.model.js');
const { default: Opportunity } = await import('../../models/opportunity.model.js');
const { default: Application } = await import('../../models/application.model.js');
const { default: Organization } = await import('../../models/organization.model.js');
const { default: User } = await import('../../models/user.model.js');
const { default: Volunteer } = await import('../../models/volunteer.model.js');
const { default: Notification } = await import('../../models/notification.model.js');

describe('AdminService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getReportedOpportunities groups reports by opportunity and skips nulls', async () => {
    const mockReports = [
      { opportunity: { opportunityId: 1, title: 'Opp 1' } },
      { opportunity: { opportunityId: 1, title: 'Opp 1' } },
      { opportunity: null },
      { opportunity: { opportunityId: 2, title: 'Opp 2' } },
    ];

    Report.findAll.mockResolvedValue(mockReports);

    const result = await AdminService.getReportedOpportunities();

    expect(result).toHaveLength(2);
    expect(result[0].reportCount).toBe(2);
    expect(result[1].reportCount).toBe(1);
  });

  test('keepOpportunity returns error when opportunity missing', async () => {
    Opportunity.findByPk.mockResolvedValue(null);

    const result = await AdminService.keepOpportunity(1);

    expect(result).toEqual({ error: 'Opportunity not found.' });
  });

  test('keepOpportunity deletes reports when opportunity exists', async () => {
    Opportunity.findByPk.mockResolvedValue({ opportunityId: 1 });

    const result = await AdminService.keepOpportunity(1);

    expect(Report.destroy).toHaveBeenCalledWith({ where: { opportunityId: 1 } });
    expect(result).toEqual({ ok: true });
  });

  test('removeOpportunity returns error when opportunity missing', async () => {
    Opportunity.findByPk.mockResolvedValue(null);

    const result = await AdminService.removeOpportunity(1);

    expect(result).toEqual({ error: 'Opportunity not found.' });
  });

  test('removeOpportunity deletes dependencies and notifies org when found', async () => {
    Opportunity.findByPk.mockResolvedValue({
      opportunityId: 1,
      organizationId: 10,
      title: 'Test Opp',
    });
    Organization.findByPk.mockResolvedValue({ userId: 42 });

    const result = await AdminService.removeOpportunity(1, 'Bad content');

    expect(Application.destroy).toHaveBeenCalled();
    expect(Report.destroy).toHaveBeenCalled();
    expect(Opportunity.destroy).toHaveBeenCalled();
    expect(Notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 42,
        message: expect.stringContaining('Bad content'),
      }),
      expect.any(Object)
    );
    expect(result).toEqual({ ok: true });
  });

  test('suspendOpportunity returns error when opportunity missing', async () => {
    Opportunity.findByPk.mockResolvedValue(null);

    const result = await AdminService.suspendOpportunity(1, 'Reason');

    expect(result).toEqual({ error: 'Opportunity not found.' });
  });

  test('suspendOpportunity no-ops when already suspended', async () => {
    Opportunity.findByPk.mockResolvedValue({ status: 'suspended' });

    const result = await AdminService.suspendOpportunity(1, 'Reason');

    expect(result).toEqual({ ok: true });
    expect(Notification.create).not.toHaveBeenCalled();
  });

  test('suspendOpportunity updates status and notifies org', async () => {
    const mockOpp = {
      status: 'active',
      organizationId: 5,
      title: 'Cleanup',
      update: jest.fn(),
    };
    Opportunity.findByPk.mockResolvedValue(mockOpp);
    Organization.findByPk.mockResolvedValue({ userId: 99 });

    const result = await AdminService.suspendOpportunity(1, 'Fraud');

    expect(mockOpp.update).toHaveBeenCalledWith({ status: 'suspended' });
    expect(Notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 99,
        message: expect.stringContaining('Fraud'),
      })
    );
    expect(result).toEqual({ ok: true });
  });

  test('unsuspendOpportunity returns error when opportunity missing', async () => {
    Opportunity.findByPk.mockResolvedValue(null);

    const result = await AdminService.unsuspendOpportunity(1);

    expect(result).toEqual({ error: 'Opportunity not found.' });
  });

  test('unsuspendOpportunity no-ops when already active', async () => {
    Opportunity.findByPk.mockResolvedValue({ status: 'active' });

    const result = await AdminService.unsuspendOpportunity(1);

    expect(result).toEqual({ ok: true });
    expect(Notification.create).not.toHaveBeenCalled();
  });

  test('unsuspendOpportunity updates status and notifies org', async () => {
    const mockOpp = {
      status: 'suspended',
      organizationId: 7,
      title: 'Tutoring',
      update: jest.fn(),
    };
    Opportunity.findByPk.mockResolvedValue(mockOpp);
    Organization.findByPk.mockResolvedValue({ userId: 11 });

    const result = await AdminService.unsuspendOpportunity(1);

    expect(mockOpp.update).toHaveBeenCalledWith({ status: 'active' });
    expect(Notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 11,
        message: expect.stringContaining('reinstated'),
      })
    );
    expect(result).toEqual({ ok: true });
  });

  test('listPendingOrganizations returns unverified orgs', async () => {
    const mockOrgs = [{ organizationId: 1 }];
    Organization.findAll.mockResolvedValue(mockOrgs);

    const result = await AdminService.listPendingOrganizations();

    expect(Organization.findAll).toHaveBeenCalled();
    expect(result).toBe(mockOrgs);
  });

  test('verifyOrganization returns error when org missing', async () => {
    Organization.findByPk.mockResolvedValue(null);

    const result = await AdminService.verifyOrganization(1);

    expect(result).toEqual({ error: 'Organization not found.' });
  });

  test('verifyOrganization sets org verified and activates user', async () => {
    const mockOrg = { isVerified: false, userId: 22, save: jest.fn() };
    const mockUser = { status: 'suspended', save: jest.fn() };
    Organization.findByPk.mockResolvedValue(mockOrg);
    User.findByPk.mockResolvedValue(mockUser);

    const result = await AdminService.verifyOrganization(1);

    expect(mockOrg.isVerified).toBe(true);
    expect(mockOrg.save).toHaveBeenCalled();
    expect(mockUser.status).toBe('active');
    expect(mockUser.save).toHaveBeenCalled();
    expect(result.ok).toBe(true);
  });

  test('rejectOrganization returns error when org missing', async () => {
    Organization.findByPk.mockResolvedValue(null);

    const result = await AdminService.rejectOrganization(1);

    expect(result).toEqual({ error: 'Organization not found.' });
  });

  test('rejectOrganization deactivates user and sets org unverified', async () => {
    const mockOrg = { isVerified: true, userId: 3, save: jest.fn() };
    const mockUser = { status: 'active', save: jest.fn() };
    Organization.findByPk.mockResolvedValue(mockOrg);
    User.findByPk.mockResolvedValue(mockUser);

    const result = await AdminService.rejectOrganization(1);

    expect(mockUser.status).toBe('deactivated');
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockOrg.isVerified).toBe(false);
    expect(mockOrg.save).toHaveBeenCalled();
    expect(result).toEqual({ ok: true });
  });

  test('listUsers applies role/status filter and search', async () => {
    User.findAll.mockResolvedValue([
      { userId: 1, email: 'vol@example.com', role: 'volunteer', status: 'active', createdAt: new Date() },
      { userId: 2, email: 'org@example.com', role: 'organization', status: 'active', createdAt: new Date() },
      { userId: 3, email: 'admin@example.com', role: 'admin', status: 'active', createdAt: new Date() },
    ]);
    Volunteer.findAll.mockResolvedValue([{ userId: 1, fullName: 'Vol Name' }]);
    Organization.findAll.mockResolvedValue([{ userId: 2, name: 'Org Name' }]);

    const result = await AdminService.listUsers({
      search: 'vol',
      role: 'volunteer,admin',
      status: 'active',
      limit: 10,
      offset: 0,
    });

    expect(User.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          role: { [Op.in]: ['volunteer', 'admin'] },
          status: 'active',
        },
      })
    );
    expect(result.total).toBe(1);
    expect(result.users[0].name).toBe('Vol Name');
  });

  test('getUserDetails returns null when user missing', async () => {
    User.findByPk.mockResolvedValue(null);

    const result = await AdminService.getUserDetails(1);

    expect(result).toBeNull();
  });

  test('getUserDetails returns user with volunteer/org details', async () => {
    const mockUser = { userId: 1 };
    User.findByPk.mockResolvedValue(mockUser);
    Volunteer.findOne.mockResolvedValue({ userId: 1 });

    const result = await AdminService.getUserDetails(1);

    expect(result.user).toBe(mockUser);
    expect(result.volunteer).toBeTruthy();
    expect(result.organization).toBeUndefined();
  });

  test('updateUserStatus returns null when user missing', async () => {
    User.findByPk.mockResolvedValue(null);

    const result = await AdminService.updateUserStatus(1, 'suspended');

    expect(result).toBeNull();
  });

  test('updateUserStatus updates user status', async () => {
    const mockUser = { status: 'active', save: jest.fn() };
    User.findByPk.mockResolvedValue(mockUser);

    const result = await AdminService.updateUserStatus(1, 'deactivated');

    expect(mockUser.status).toBe('deactivated');
    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toBe(mockUser);
  });

  test('listOrganizations filters by search and verification status', async () => {
    Organization.findAll.mockResolvedValue([
      {
        organizationId: 1,
        userId: 11,
        name: 'Green Earth',
        description: 'Env',
        isVerified: true,
        createdAt: new Date(),
        user: { email: 'green@earth.org', status: 'active' },
      },
      {
        organizationId: 2,
        userId: 12,
        name: 'Pending Org',
        description: 'Pending',
        isVerified: false,
        createdAt: new Date(),
        user: { email: 'pending@org.org', status: 'active' },
      },
    ]);
    Opportunity.count.mockResolvedValue(3);
    Application.count.mockResolvedValue(5);

    const result = await AdminService.listOrganizations({
      search: 'green',
      verificationStatus: 'verified',
      limit: 10,
      offset: 0,
    });

    expect(result.total).toBe(1);
    expect(result.organizations[0].name).toBe('Green Earth');
    expect(result.organizations[0].opportunitiesCreated).toBe(3);
  });

  test('getOrganizationDetails returns null when org missing', async () => {
    Organization.findByPk.mockResolvedValue(null);

    const result = await AdminService.getOrganizationDetails(1);

    expect(result).toBeNull();
  });

  test('getOrganizationDetails returns metrics', async () => {
    Organization.findByPk.mockResolvedValue({
      organizationId: 1,
      userId: 2,
      name: 'Org',
      description: 'Desc',
      isVerified: true,
      createdAt: new Date(),
      user: { email: 'org@example.com' },
    });
    Opportunity.count.mockResolvedValue(2);
    Application.count.mockResolvedValue(4);

    const result = await AdminService.getOrganizationDetails(1);

    expect(result.opportunitiesCreated).toBe(2);
    expect(result.applicationsReceived).toBe(4);
    expect(result.volunteersApplied).toBe(4);
  });

  test('listAllOpportunities returns total and rows', async () => {
    Opportunity.count.mockResolvedValue(25);
    Opportunity.findAll.mockResolvedValue([{ opportunityId: 1 }]);

    const result = await AdminService.listAllOpportunities({ limit: 10, offset: 0 });

    expect(result.total).toBe(25);
    expect(result.opportunities).toHaveLength(1);
  });
});
