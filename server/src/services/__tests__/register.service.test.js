import { jest } from '@jest/globals';

// Mock User model 
jest.unstable_mockModule('../../models/user.model.js', () => ({
    
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
    },

}));

// Mock bcrypt 
jest.unstable_mockModule('bcrypt', () => ({
    
    default: {
        hash: jest.fn(),
    },

}));


const { registerAccount } = await import('../registration.service.js');
const { default: User } = await import('../../models/user.model.js');
const { default: bcrypt } = await import('bcrypt');


// Test suite 
describe('registerAccount', () => {

    // Ensure test isolation
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test1: Email already exists
    test('should throw error if email already exists', async () => {

        // Arrange
        User.findOne.mockResolvedValue({
        email: 'test@mail.com',
        });

        // Act + Assert
        await expect(
        registerAccount('test@mail.com', 'password123')
        ).rejects.toThrow(
        'This email is already registered to another account. Please login!'
        );

    });


    test('should create and return a new user if email does not exist', async () => {

        // Arrange
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedPassword');

        const mockRegistration = {
        email: 'test@mail.com',
        password: 'hashedPassword',
        role: 'volunteer',
        };

        User.create.mockResolvedValue(mockRegistration);

        // Act
        const result = await registerAccount('test@mail.com', 'password123');

        // Assert
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(User.create).toHaveBeenCalled();
        expect(result).toBe(mockRegistration);

    });

});
