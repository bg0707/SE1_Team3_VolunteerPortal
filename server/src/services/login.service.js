import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

export async function authenticateUser(email, password) {

    // verify if email is in the database if so store it in user
    const user = await User.findOne({ where: { email } });

    // if user email is not found return error message
    if (!user) {
        return {error: "Email not found. Please register first."};
    }

    // check if the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return {error: "Invalid password. Please try again."};
    }

    // if the email exists and the pasasword matches the user password then return user
    return user;
}

export default authenticateUser; 
