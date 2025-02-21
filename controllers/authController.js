const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
    try{
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message: "Please enter all fields"});
            }
        
        //check if user exist
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User already exists"});
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        res.status(201).json({message: "User created successfully"});
    }catch(error){
        res.status(500).json({message: "authContrller Server Error"});
    }
};

// Login a user
const loginUser = async (req, res) =>{
    try{
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).json({message: "Please enter all fields"});
        }

        //check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }

        //check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        //create token
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1d"});

        res.json({token, user:{id: user._id, name: user.name, email: user.email, role: user.role}});
    }catch (error){
        res.status(500).json({message: "authController Server Error"});
    }
};

const updateProfile = async (req, res) => {
    try {
        const {userId} = req.user;
        const {name, preferences, profilePicture} = req.body;

        const updatedUser = await user.findByIdAndUpdate(userId, {
            name,preferences, profilePicture},
            {new: true}
        );
        res.json({message: "Profile updated successfully", user: updatedUser});

    }catch(error)
    {
        res.status(500).json({message: "auth Server error"})
    }
}
module.exports = {registerUser, loginUser, updateProfile};
