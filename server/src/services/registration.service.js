import { hash } from 'bcrypt';
import User from '../models/user.model.js'



export const registerAccount = async(email, password) => {
    const userEmail = String(email);
    const userPassword = String(password);

    // verify if account does not exist in database
    const existing = await User.findOne({
        where: {email: userEmail}
    })
    
    if(existing){
        throw new Error('This email is already registered to another account. Please login!')   
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    // create new registration
    const registration = await User.create({
        email : userEmail,
        password : hashedPassword,
        role : "volunteer",
        createdAt : new Date()
    
    })

    return registration;

    
}