const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const clientURL = process.env.CLIENT_URL;

const createToken = (_id) => {
    // TODO change in production to 8h or 1d
    return jwt.sign({ _id: _id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        // create token
        const token = createToken(user._id);

        res.status(201).json({ email, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// sign up user
const signupUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.signup(email, password);

        // create token
        const token = createToken(user._id);

        res.status(201).json({ email, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// verify user
const verifyUser = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.updateVerified(token);

        // Render a success HTML page
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .container {
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        padding: 20px;
                        text-align: center;
                        max-width: 400px;
                        width: 100%;
                    }
                    h1 {
                        color: #333;
                    }
                    p {
                        color: #666;
                    }
                    .btn {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #739fee;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                        font-size: 16px;
                    }
                    .btn:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Email Verified!</h1>
                    <p>Your email has been successfully verified.</p>
                    <p><a href="${clientURL}" class="btn">Go to Market Monitor</a></p>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        // Handle errors and display error page
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .container {
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        padding: 20px;
                        text-align: center;
                        max-width: 400px;
                        width: 100%;
                    }
                    h1 {
                        color: #333;
                    }
                    p {
                        color: #666;
                    }
                    .btn {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #739fee;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                        font-size: 16px;
                    }
                    .btn:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Verification Failed</h1>
                    <p>There was an error verifying your email. Please Contact Us.</p>
                    <p><a href="${clientURL}/contactus" class="btn">Go to Market Monitor-Contact Us</a></p>
                </div>
            </body>
            </html>
        `);
    }
};


module.exports = { signupUser, loginUser, verifyUser };
