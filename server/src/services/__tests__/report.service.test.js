import { jest } from '@jest/globals';

// Mocking Volunteer model
jest.unstable_mockModule('../../models/volunteer.model.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

// Mocking Opportunity model
jest.unstable_mockModule('../../models/opportunity.model.js', () => ({
  default: {
    findByPk: jest.fn(),
  },
}));

// Mocking Report model
jest.unstable_mockModule('../../models/report.model.js', () => ({
  default: {
    create: jest.fn(),
  },
}));

const { ReportService } = await import('../report.service.js');
const { default: Volunteer } = await import('../../models/volunteer.model.js');
const { default: Opportunity } = await import('../../models/opportunity.model.js');
const { default: Report } = await import('../../models/report.model.js');

describe('ReportService.createReport', () => {
  const userId = 1;
  const opportunityId = 10;
  const content = 'This is a test report';

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Volunteer not found
  test('should return error if volunteer is not found', async () => {
    // Arrange
    Volunteer.findOne.mockResolvedValue(null);

    // Act
    const result = await ReportService.createReport(
      userId,
      opportunityId,
      content
    );

    // Assert
    expect(result).toEqual({
      error: 'Volunteer not found.',
    });
  });

  // Test 2: Opportunity not found
  test('should return error if opportunity is not found', async () => {
    // Arrange
    Volunteer.findOne.mockResolvedValue({ volunteerId: 5 });
    Opportunity.findByPk.mockResolvedValue(null);

    // Act
    const result = await ReportService.createReport(
      userId,
      opportunityId,
      content
    );

    // Assert
    expect(result).toEqual({
      error: 'Opportunity not found.',
    });
  });

  // Test 3: Successful report creation
  test('should create and return report if volunteer and opportunity exist', async () => {
    // Arrange
    const mockVolunteer = { volunteerId: 5 };
    const mockOpportunity = { opportunityId };
    const mockReport = {
      reportId: 1,
      volunteerId: 5,
      opportunityId,
      content,
    };

    Volunteer.findOne.mockResolvedValue(mockVolunteer);
    Opportunity.findByPk.mockResolvedValue(mockOpportunity);
    Report.create.mockResolvedValue(mockReport);

    // Act
    const result = await ReportService.createReport(
      userId,
      opportunityId,
      content
    );

    // Assert
    expect(result).toBe(mockReport);
  });
});
