const { sendEmail } = require('../models/emailService');


// 
const contactUs = async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        const msg = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
        const sbj = 'Market Monitor - Contact Us - ' + subject;
        const emailResult = await sendEmail(name, email, sbj, msg, process.env.EMAIL);
        if (emailResult.success) {
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false, message:  emailResult.message });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


module.exports = { contactUs };
