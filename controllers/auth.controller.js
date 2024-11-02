const { user } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const saltRounds = 10;

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the link: 
        http://localhost:3000/verifikasi-email/${token}`,
    };

    await transporter.sendMail(mailOptions)
        .then(() => {
            console.log('Email sent successfully');
        })
        .catch((error) => {
            console.error('Error sending email:', error);
        })
}

const register = async (req, res) => {
    const { Fullname, Username, Email, Password } = req.body;
    try {
        const existingUser = await user.findOne({
            where: {
                [Op.or]: [
                    { Username: Username },
                    { Email: Email }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists." });
        }

        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        const verificationToken = uuidv4();

        const newUser = await user.create({
            Fullname,
            Username,
            Email,
            Password: hashedPassword,
            VerificationToken: verificationToken
        });

        await sendVerificationEmail(Email, verificationToken);

        return res.status(201).json({ message: "User created successfully, please verify your email." });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Error registering user", error });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const userToVerify = await user.findOne({ where: { verificationToken: token } });
        if (!userToVerify) {
            return res.status(404).json({ message: "Invalid verification token" });
        }
        userToVerify.Verified = true;
        userToVerify.VerificationToken = null;
        await userToVerify.save();
        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error verifying email:", error);
        return res.status(500).json({ message: "Error verifying email", error });
    }
}

const login = async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const existingUser = await user.findOne({ where: { Email } });

        if (!existingUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(Password, existingUser.Password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: existingUser.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Error logging in", error });
    }
};

const getAllUser = async (req, res) => {
    try {
        const allUser = await user.findAll();
        if (allUser.length === 0) {
            return res.status(200).json({ message: "No users found." });
        }
        return res.status(200).json(allUser);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Error fetching users", error });
    }
};

const getUserById = async (req, res) => {
    const id = req.params.id;
    try {
        const foundUser = await user.findByPk(id);
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(foundUser);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Error fetching user", error });
    }
};

module.exports = {
    register,
    login,
    getAllUser,
    getUserById,
    verifyEmail
};