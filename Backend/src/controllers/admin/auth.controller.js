import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ErrorResponse } from "../../utils/errorResponse.util.js";
import User from "../../models/User.model.js";
import generateToken from "../../utils/generateToken.js";
import crypto from "crypto";
import { sendEmail } from "../../services/email.service.js";

export const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "admin" }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
        throw new ErrorResponse("Invalid admin credentials", 401);
    }

    const token = generateToken(res, user._id);
    const { password: pwd, ...safeUser } = user._doc;

    res.status(200).json({
        success: true,
        data: {
            token,
            user: safeUser,
        }
    });
});

export const adminForgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email, role: "admin" });

    if (!user) {
        // Don't reveal if user exists for security
        return res.status(200).json({
            success: true,
            message: "If that email exists, a password reset link has been sent.",
        });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // Create reset URL (dynamic based on request or env)
    const resetUrl = `${req.protocol}://${req.get("host")}/admin/reset-password/${resetToken}`;
    const clientResetUrl = process.env.CLIENT_URL 
        ? `${process.env.CLIENT_URL}/admin/reset-password/${resetToken}`
        : resetUrl;

    try {
        await sendEmail({
            email: user.email,
            subject: "Admin Password Reset Request",
            message: `You requested a password reset for your admin account. Please click the following link to reset your password:\n\n${clientResetUrl}\n\nThis link will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
        });

        res.status(200).json({
            success: true,
            message: "Password reset email sent",
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        throw new ErrorResponse("Email could not be sent", 500);
    }
});

export const adminResetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token to compare with stored hash
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
        role: "admin",
    }).select("+password");

    if (!user) {
        throw new ErrorResponse("Invalid or expired reset token", 400);
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate token and send response
    const authToken = generateToken(res, user._id);
    const { password: pwd, ...safeUser } = user._doc;

    res.status(200).json({
        success: true,
        message: "Password reset successful",
        data: {
            token: authToken,
            user: safeUser,
        },
    });
});
