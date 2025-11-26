import {registerAccount} from '../services/registration.service.js';

export const handleRegisterAccount = async (req, res) => {

    try{
        console.log("Received registration request:", req.body);
        const { email, password } = req.body;
        const registration = await registerAccount(email, password);
        res.status(201).json({ message: 'Registration successful', registration });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}