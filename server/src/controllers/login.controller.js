import jwt from 'jsonwebtoken';
import authenticateUser from '../services/login.service.js';
import asyncHandler from 'express-async-handler';
import Volunteer from '../models/volunteer.model.js';
import Organization from '../models/organization.model.js';
import { ActivityLogService } from "../services/activityLog.service.js";

const loginController = asyncHandler(async (req, res) => {

    // Extract email and password from request body
    const email = req.body.email;
    const password = req.body.password;


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

        if (user.status === 'suspended') {
            return res.status(403).json({
                message: 'Your account is temporarily suspended. Contact admin support.',
            });
        }

        if (user.status === 'deactivated') {
            return res.status(403).json({
                message: 'Your account is deactivated. Contact support to reactivate.',
            });
        }

        let extraData = {};

        // Fetch extra info depending on role
        if (user.role === 'volunteer') {
            const volunteer = await Volunteer.findOne({ where: { userId: user.userId } });
            if (volunteer) {
                extraData = {
                    fullName: volunteer.fullName,
                    age: volunteer.age,
                    createdAt: volunteer.createdAt
                };
            }
        } else if (user.role === 'organization') {

            const organization = await Organization.findOne({ where: { userId: user.userId } });
            if (organization) {
                extraData = {
                    organizationName: organization.name,
                    description: organization.description,
                    isVerified: organization.isVerified,
                    createdAt: organization.createdAt
                };
            }
        }


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
        await ActivityLogService.log({
            actorUserId: user.userId,
            action: "user.login",
            entityType: "user",
            entityId: user.userId,
            metadata: {
                role: user.role,
                ip: req.ip,
                userAgent: req.headers["user-agent"],
            },
        });

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                userId: user.userId,
                email: user.email,
                role:user.role,
                ...extraData
            }
        });

    }

    catch (error) {

        console.log(error);
        res.status(500).json({ message: 'Server error11', error: error.message });
    }

});

export default loginController;
