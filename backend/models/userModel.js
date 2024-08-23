const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require('crypto');  // Import the crypto module
const secretKey = process.env.EMAIL_SECRET;  // Define or retrieve the secret key
const serverURL = process.env.SERVER_URL;

const Schema = mongoose.Schema;
const { sendEmail } = require('../models/emailService');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
    },
});

// static signup method
userSchema.statics.signup = async function (email, password) {
    // validation
    if (!email || !password) {
        throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
        throw Error("Email not valid");
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Password not strong enough");
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hash , verified: false});

    // send email, using emailService
    try {

        // Create an encrypted token
        // Generate a random initialization vector
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
        let token = cipher.update(email, 'utf8', 'hex');
        token += cipher.final('hex');
        const tokenIv = iv.toString('hex') + ':' + token; // Include IV with token

        const subject = "verify your email - market.monitor";
        const message = 
            `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #333333;
                    }
                    p {
                        color: #666666;
                    }
                    .btn {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #739fee;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    .btn:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>

            <body>
                <div class="container">
                    <h1>Welcome to Market Monitor</h1>
                    <p>Please click the following link to complete your registration:</p>
                    <p><a class="btn" href="${serverURL}/api/user/verify?token=${tokenIv}" target="_blank">Verify Email</a></p>
                    <p style="font-size: smaller;"><em>${serverURL}/api/user/verify?token=${tokenIv}</em></p>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                    <p>Thank you!</p>
                </div>                
            </body>
            </html>
        `;
        const result = await sendEmail('Market Monitor', process.env.EMAIL, subject, message, email);
        if (!result.success) {
            throw new Error('Failed to send email:', result.message);
        }
    } catch (err) {
        console.error('Error in email sending process:', err.message);
        throw new Error(`Failed to send email: ${err.message}`);
    }
    

    return user;
};

// static login method
userSchema.statics.login = async function (email, password) {

    const user = await this.findOne({ email });
    if (!user) {
        throw Error("Incorrect email");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error("Incorrect password");
    }

    if(!user.verified){
        throw Error("Email not verified");
    }

    return user;
};

// verifing the user
userSchema.statics.updateVerified = async function (tokenIv) {
    try {
        // Split the tokenIv into IV and token
        const [ivHex, token] = tokenIv.split(':');
        const iv = Buffer.from(ivHex, 'hex');

        // Decrypt the token to get the email
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
        let email = decipher.update(token, 'hex', 'utf8');
        email += decipher.final('utf8');

        // Find the user by email and update the verified field
        const user = await this.findOneAndUpdate({ email }, { verified: true }, { new: true });

        if (!user) {
            throw Error("User not found");
        }

        return user;
    } catch (error) {
        console.log(`Failed to verify email: ${error.message}`);
    }
};


module.exports = mongoose.model("User", userSchema);
