import { jest } from '@jest/globals';
import { Op } from 'sequelize';


// Mock Models
jest.unstable_mockModule('../../models/opportunity.model.js', () => ({
    
    default: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },

}));

// Mock Category Model
jest.unstable_mockModule('../../models/category.model.js', () => ({
    
    default: {},

}));

// Mock Organization Model
jest.unstable_mockModule('../../models/organization.model.js', () => ({
    
    default: {},

}));


const { OpportunityService } = await import('../opportunity.service.js');
const { default: Opportunity } = await import('../../models/opportunity.model.js');

// Test suite
describe('OpportunityService', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: getAllOpportunities
    test('should return all opportunities when no filters are provided', async () => {
        
        // Arrange
        const mockOpportunities = [{ id: 1 }, { id: 2 }];
        Opportunity.findAll.mockResolvedValue(mockOpportunities);

        // Act
        const result = await OpportunityService.getAllOpportunities({});

        // Assert
        expect(Opportunity.findAll).toHaveBeenCalled();
        expect(result).toBe(mockOpportunities);

    });

    // Test 2: getAllOpportunities with category filter
    test('should apply category filter', async () => {
        
        // Arrange
        Opportunity.findAll.mockResolvedValue([]);

        // Act
        await OpportunityService.getAllOpportunities({ categoryId: 3 });

        // Assert
        expect(Opportunity.findAll).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { categoryId: 3 },
            })
        );

    });

    // Test 3: getAllOpportunities with title and description search filter
    test('should apply search filter on title and description', async () => {
        
        // Arrange
        Opportunity.findAll.mockResolvedValue([]);

        // Act
        await OpportunityService.getAllOpportunities({ search: 'help' });

        // Assert
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

    // Test 4: getOpportunityById
    test('should return opportunity by id', async () => {
        
        // Arrange
        const mockOpportunity = { id: 1, title: 'Volunteer' };
        Opportunity.findByPk.mockResolvedValue(mockOpportunity);

        // Act
        const result = await OpportunityService.getOpportunityById(1);

        // Assert
        expect(Opportunity.findByPk).toHaveBeenCalledWith(
            1,
            expect.objectContaining({
                include: expect.any(Array),
            })
        );
        expect(result).toBe(mockOpportunity);

    });

    // Test 5: getOpportunityById - not found
    test('should return null if opportunity does not exist', async () => {
        // Arrange
        Opportunity.findByPk.mockResolvedValue(null);

        // Act
        const result = await OpportunityService.getOpportunityById(999);

        // Assert
        expect(result).toBeNull();
    });

    // Test 6: getAllOpportunities - no opportunities found
    test('should return an empty array when no opportunities are found', async () => {
        
        // Arrange
        Opportunity.findAll.mockResolvedValue([]);

        // Act
        const result = await OpportunityService.getAllOpportunities({});

        // Assert
        expect(Opportunity.findAll).toHaveBeenCalled();
        expect(result).toEqual([]);
    
    });

});
