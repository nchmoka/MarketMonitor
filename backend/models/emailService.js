// emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail'
    auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.PASSWORD // Your email password
    }
});

const sendEmail = async (name, email, subject, message) => {
    const mailOptions = {
        from: email, // Your email address
        to: process.env.EMAIL, // Your email address
        subject: 'Market Monitor - Contact Us - ' + subject,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        replyTo: email // Sets the reply-to address
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Failed to send email' };
    }
};

module.exports = { sendEmail };
