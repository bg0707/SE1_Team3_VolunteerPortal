import { jest } from '@jest/globals';

jest.unstable_mockModule('../../models/user.model.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: {
    compare: jest.fn(),
  },
}));


const { default: authenticateUser } = await import('../login.service.js');
const { default: User } = await import('../../models/user.model.js');
const { default: bcrypt } = await import('bcrypt');

// This is the test suite f
describe('authenticateUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Email not found
  test('should return error if email is not found', async () => {
    // Arrange
    User.findOne.mockResolvedValue(null);

    // Act
    const result = await authenticateUser('test@mail.com', 'password123');

    // Assert
    expect(result).toEqual({
      error: 'Email not found. Please register first.',
    });

  });
  
  // Test 2: Invalid password
  test('should return error if password is invalid', async () => {
    
    // Arrange
    const mockUser = {
      email: 'test@mail.com',
      password: 'hashedPassword',
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    // Act
    const result = await authenticateUser('test@mail.com', 'wrongPassword');

    // Assert
    expect(result).toEqual({
      error: 'Invalid password. Please try again.',
    });

  });

  // Test 3: Successful authentication
  test('should return user if authentication is successful', async () => {
    // Arrange
    const mockUser = {
      id: 1,
      email: 'test@mail.com',
      password: 'hashedPassword',
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    // Act
    const result = await authenticateUser('test@mail.com', 'correctPassword');

    // Assert
    expect(result).toBe(mockUser);
  });
  
});
