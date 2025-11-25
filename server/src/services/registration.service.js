import User from '../models/user.model.js'
import Registration from '../models/registration.model.js'


export const registerAccount = async(email, password) => {
    const userEmail = String(email);
    const userPassword = String(password);

    // verify if account does not exist in database
    const existing = await Registration.findOne({
        where: {email: userEmail}
    })
    
    if(existing){
        throw new Error('This email is already registered to another account. Please login!')   
    }

    // create new registration
    const registration = await Registration.create({
        //userId: ... still need to figure out
        email : userEmail,
        password : userPassword

    })

    
}