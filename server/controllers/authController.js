const User = require('../models/User');
const jwt = require('jsonwebtoken');


exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const user = await User.create({
            username,
            email,
            password,
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        console.error(err);

        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }
        res.status(400).json({ success: false, error: err.message });
    }
};


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }


        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }


        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.logout = (req, res, next) => {
    let options =  {
        httpOnly: true,
        secure: false, // Recommended for production
        sameSite: 'Lax', // If your frontend and backend are on different domains
        path: '/' // Ensure this matches the path used when the cookie was set
    }
     if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.clearCookie('token',options);

    res.status(200).json({ success: true, data: {} });
};


exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


const sendTokenResponse = (user, statusCode, res) => {

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        secure: false, // Recommended for production
        sameSite: 'Lax',
        httpOnly: true,
        path:"/"
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
        });
};
