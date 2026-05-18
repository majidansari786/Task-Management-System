const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const user_model = require('../model/User')
const generateToken = require('../middleware/generateToken');

async function signup(req,res) {
    const {name, email, pass} = req.body;
    const hashedpass = await bcrypt.hash(pass,10);
    const existingUser = await user_model.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    };
    const newUser = new user_model({name,email,password: hashedpass});
    await newUser.save();
    
    const token = generateToken(newUser._id,newUser.role);

    return res.status(200)
            .cookie("userAccessToken", token, {
                httpOnly: true,
                secure: false,
                sameSite: "Lax",
                maxAge: 24 * 60 * 60 * 1000,
            }).json({SUCCESS:"USER CREATED."});
}

module.exports = {
    signup
}