const express = require("express");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const Note = require("../model/note.model");
const { User } = require("../model/user.model");

const router = express.Router();
dotenv.config();

router.route("/login")
.post(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user === null) {
            return res.status(404).json({
                success: false,
                message: "Looks like you have not signed up."
            });
        };

        let matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            });
        };

        let secret = process.env.JWT_SECRET
        const token = jwt.sign( {userId: user._id}, secret, {expiresIn: "24h"} );

        return res.json({ 
            success: true, 
            message: "Auth success", 
            userId: user._id, 
            token, 
            firstName: user.firstName,
            lastName: user.lastName
        });

    } catch(error) {
        console.log(error);
        return res.status(401).json({ 
            success: false, 
            message: "Auth failed", 
            errorMessage: error.message 
        });
    };
});

router.route("/signup")
.post(async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        
        const emialAlreadyExists = await User.findOne({ email });

        if (emialAlreadyExists !== null) {
            return res.status(409).json({
                success: false,
                message: "Email already exists. Please login"
            });
        };

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        const saveUser = await newUser.save();

        const newNote = new Note({
            _id: saveUser._id,
            noteTitle: "Untitled Note",
            noteBody: "This is a sample note.Feel free to edit this",
            isPinned: false,
            bgColor: "bg-l-yellow"
        });

        await newNote.save();

        const secret = process.env.JWT_SECRET;
        const token = jwt.sign( { userId: saveUser._id }, secret, { expiresIn: "24h" } );

        res.json({
            success: true,
            message: "Sign up successful",
            userId: saveUser._id,
            firstName,
            lastName,
            token
        });        

    } catch(error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Cannot create user",
            errMessage: error.message
        });
    }
});

module.exports = router;