import jwt from 'jsonwebtoken';
import authenticateUser from '../services/login.service.js';
import asyncHandler from 'express-async-handler';

const loginController = asyncHandler(async (req, res) => {

    // Extract email and password from request body
    const email = req.body.email;
    const password = req.body.password;
    
    console.log("Login body:", req.body);

    try {

        //  verify JWT_SECRET is defined
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        
        // Authenticate user 
        let potentialUser;
        try {
            potentialUser = await authenticateUser(email, password);
        } catch (err) {
            console.log("Authenticate error:", err);
            return res.status(500).json({ message: "Authentication failed", error: err.message });
        }


        // Check for authentication errors
        if (potentialUser.error) {
            return res.status(401).json({ message: potentialUser.error });
        }

        const user = potentialUser;

        // Login successful, generate JWT token
        const token = jwt.sign(
            {
                userId: user.userId,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );



        // Send response with token
        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                userId: user.userId,
                email: user.email,
                role: user.role
            }
        });

    }

    catch (error) {

        console.log(error);
        res.status(500).json({ message: 'Server error11', error: error.message });
    }

});

export default loginController;