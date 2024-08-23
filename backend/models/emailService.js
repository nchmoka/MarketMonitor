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

const sendEmail = async (name, email_from, subject, message, email_to) => {
    const mailOptions = {
        from: email_from,
        to: email_to,
        subject: subject,
        html: message,
        replyTo: email_from
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
