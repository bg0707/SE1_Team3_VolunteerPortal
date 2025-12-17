import { jest } from '@jest/globals';

// Mock Models
jest.unstable_mockModule('../../models/application.model.js', () => ({
    
    default: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
    },

}));

// Mock Opportunity Model
jest.unstable_mockModule('../../models/opportunity.model.js', () => ({
    
    default: {
        findByPk: jest.fn(),
    },

}));

// Mock Volunteer Model
jest.unstable_mockModule('../../models/volunteer.model.js', () => ({
    
    default: {
        findOne: jest.fn(),
    },

}));

// Mock Organization Model
jest.unstable_mockModule('../../models/organization.model.js', () => ({
    
    default: {},

}));

const { ApplicationService } = await import('../application.service.js');
const { default: Application } = await import('../../models/application.model.js');
const { default: Opportunity } = await import('../../models/opportunity.model.js');
const { default: Volunteer } = await import('../../models/volunteer.model.js');


// Test suite
describe('ApplicationService', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: error when volunteer not found
    test('should return error if volunteer is not found', async () => {
        
        // Arrange
        Volunteer.findOne.mockResolvedValue(null);

        // Act
        const result = await ApplicationService.apply(1, 10);

        // Assert
        expect(result).toEqual({ error: 'Volunteer not found' });

    });

    // Test 2: error when opportunity not found
    test('should return error if opportunity is not found', async () => {
        
        // Arrange
        Volunteer.findOne.mockResolvedValue({ volunteerId: 5 });
        Opportunity.findByPk.mockResolvedValue(null);

        // Act
        const result = await ApplicationService.apply(1, 10);

        // Assert
        expect(result).toEqual({ error: 'Opportunity not found.' });

    });

    // Test 3: error when application already exists
    test('should return error if application already exists', async () => {
        
        // Arrange
        Volunteer.findOne.mockResolvedValue({ volunteerId: 5 });
        Opportunity.findByPk.mockResolvedValue({ id: 10 });
        Application.findOne.mockResolvedValue({ id: 99 });

        // Act
        const result = await ApplicationService.apply(1, 10);

        // Assert
        expect(result).toEqual({
            error: 'You have already applied to this opportunity.',
        });

    });

    // Test 4: successful application creation
    test('should create and return a new application', async () => {
        
        // Arrange
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

        // Act
        const result = await ApplicationService.apply(1, 10);

        // Assert
        expect(Application.create).toHaveBeenCalledWith({
            volunteerId: 5,
            opportunityId: 10,
            status: 'pending',
        });
        expect(result).toBe(mockApplication);

    });

    // Test 5: getMyApplications - volunteer not found
    test('should return empty array if volunteer is not found', async () => {
        
        // Arrange
        Volunteer.findOne.mockResolvedValue(null);

        // Act
        const result = await ApplicationService.getMyApplications(1);

        // Assert
        expect(result).toEqual([]);

    });

    // Test 6: getMyApplications - successful fetch
    test('should return applications for the volunteer', async () => {
        
        // Arrange
        Volunteer.findOne.mockResolvedValue({ volunteerId: 5 });

        const mockApplications = [
            { id: 1, status: 'pending' },
            { id: 2, status: 'accepted' },
        ];

        Application.findAll.mockResolvedValue(mockApplications);

        // Act
        const result = await ApplicationService.getMyApplications(1);

        // Assert
        expect(Application.findAll).toHaveBeenCalled();
        expect(result).toBe(mockApplications);

    });
});
