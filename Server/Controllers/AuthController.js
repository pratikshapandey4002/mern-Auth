import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/UserModel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Enter All Fields' })
    }
    try {
        const ExistingUser = await userModel.findOne({ email: email });
        if (ExistingUser) {
            return res.status(400).json({ success: false, message: 'User with this email exists, try logging in' });
        }
        const salt = await bcrypt.genSalt(10);
        const HashedPass = await bcrypt.hash(password, salt);

        const user = new userModel({
            name: name,
            email: email,
            password: HashedPass
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Pratiksha',
            text: `Welcome to Pratiksha website. Your account has been successfully created with email id : ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "Registered Successfully" })


    } catch (error) {
        res.status(400).json({ success: false, message: error.message })

    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Enter All Fields' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "The user does not exist Try Registering" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect Password' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ success: true, message: "Logged in Successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });

    }

}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
        })
        return res.status(200).json({ success: true, message: "Logged Out" });


    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })

    }
}

export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Welcome to Pratiksha website. Your OTP is : ${otp}`
        }
        await transporter.sendMail(mailOption);
        return res.status(200).json({ success: true, message: 'Verification OTP sent on Email' });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })

    }
}

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: "Missing Data" });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "No user with this email" });
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        if (user.verifyOtpExpiredAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP already expired" });
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiredAt = 0;
        await user.save();

        return res.status(200).json({ success: true, message: "Email verified Successfully" });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })

    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: 'User is Authenticated' });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })

    }
}

//send password reset otp
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Welcome to Pratiksha website. Your OTP for password Reset is : ${otp}`
        }
        await transporter.sendMail(mailOption);
        return res.status(200).json({ success: true, message: "OTP sent to your email" });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })

    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email, OTP, and new Password are required' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        // FIX: Changed '=' to '===' below
        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP Expired" });
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();
        return res.status(200).json({ success: true, message: "Password has been reset, try logging in now" });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });

    }

}