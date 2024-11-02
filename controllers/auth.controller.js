const { user } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const saltRounds = 10;

/**
 * Sends a verification email to the specified email address.
 * 
 * @param {string} email - The recipient's email address.
 * @param {string} token - The verification token to be included in the email.
 * 
 * @returns {Promise<void>} - A promise that resolves when the email has been sent.
 * 
 * This function uses nodemailer to send an email with a verification link.
 * The email service and credentials are retrieved from environment variables.
 */
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

/**
 * Registers a new user and sends a verification email.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * 
 * @returns {Promise<void>} - A promise that resolves when the user has been registered or an error has occurred.
 * 
 * This function takes the request body's Fullname, Username, Email and Password, and attempts to create a new user in the database.
 * If a user with the same username or email already exists, a 400 error is sent.
 * Otherwise, a new user is created, a verification token is generated and sent to the user's email, and a 201 success message is sent.
 * If an error occurs, a 500 error is sent.
 */
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

/**
 * Verifies a user's email by setting the Verified field to true and clearing the VerificationToken.
 * If the verification token is invalid, a 404 error is sent.
 * If an error occurs, a 500 error is sent.
 */
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

/**
 * Logs a user in and generates a JSON Web Token.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * 
 * @returns {Promise<void>} - A promise that resolves when the user has been logged in or an error has occurred.
 * 
 * This function takes the request body's Email and Password, and attempts to find a user in the database with the same email.
 * If no user is found, a 401 error is sent.
 * Otherwise, the password is compared with the user's hashed password.
 * If the password is invalid, a 401 error is sent.
 * Otherwise, a JSON Web Token is generated and sent to the user along with a 200 success message.
 * If an error occurs, a 500 error is sent.
 */
const login = async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const existingUser = await user.findOne({ where: { Email } });

        if (!existingUser) {
            return res.status(401).json({ message: "Wrong Email" });
        }

        const match = await bcrypt.compare(Password, existingUser.Password);
        if (!match) {
            return res.status(401).json({ message: "Wrong Email or Password" });
        }

        const token = jwt.sign({ userId: existingUser.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Error logging in", error });
    }
};

/**
 * Fetches all users from the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * 
 * @returns {Promise<void>} - A promise that resolves when all users have been fetched or an error has occurred.
 * 
 * This function fetches all users from the database and returns them in the response.
 * If no users are found, a 200 success message is sent with a message indicating that no users were found.
 * If an error occurs, a 500 error is sent.
 */
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

/**
 * Fetches a user by their id from the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * 
 * @returns {Promise<void>} - A promise that resolves when the user has been fetched or an error has occurred.
 * 
 * This function fetches a user by their id from the database and returns it in the response.
 * If the user is not found, a 404 error is sent.
 * If an error occurs, a 500 error is sent.
 */
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