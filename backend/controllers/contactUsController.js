const { sendEmail } = require('../models/emailService');


// 
const contactUs = async (req, res) => {
    console.log(req.body);
    const { name, email, subject, message } = req.body;
    try {
        const emailResult = await sendEmail(name, email, subject, message);
        if (emailResult.success) {
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false, message:  emailResult.message});
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


module.exports = { contactUs };
