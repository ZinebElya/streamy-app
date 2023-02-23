import { Request, Response } from "express";
import { omit } from "lodash";
import nodemailer from "nodemailer";
import crypto from "crypto";
import User, { UserDocument } from "../model/user.model";
import { createUser } from "../service/user.service";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (e: any) {
    console.error(e);
    return res.status(409).send(e.message);
  }
}


export async function resetPassword(req: Request, res: Response) {
  const { email } = req.body;

  // Find user by email
  const user: UserDocument | null = await User.findOne({ email }).exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate reset token
  const token = crypto.randomBytes(20).toString("hex");
  const expirationDate = Date.now() + 60 * 60 * 1000; // 1 hour from now

  // Update user with reset token and expiration date
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(expirationDate);
  await user.save();

  // Send email with reset link
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: "baccouchoumaima35@gmail.com", // generated ethereal user
      pass: "xivypohidvxewqhr", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verify transporter connection configuration
  transporter.verify((error, success) => {
    if (error) {
      console.log("Failed to setup email transporter", error);
    } else {
      console.log("Email transporter configured successfully");
    }
  });

  const resetUrl = `http://localhost:3000/ResetPassord/${token}`;

  await transporter.sendMail({
    from: "your@email.com",
    // to: user.email,
    to: user.email,
    subject: "Password Reset",
    html: `Please click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.`,
  });

  res.json({ message: "Password reset email sent" });
};

export async function Verifytoken(req: Request, res: Response) {
  const { token } = req.params;

  // Find user by reset token
  const user: UserDocument | null = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  }).exec();

  if (!user) {
    return res.status(400).send({ sucess: false, message: "Invalid or expired token" });
  }

  // Render password reset form
  res.send({ sucess: true, message: 'valid' });
}

export async function updatePassword(req: Request, res: Response) {
  const { token } = req.params;
  const { password } = req.body;

  // Find user by reset token
  const user: UserDocument | null = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  }).exec();

  if (!user) {
    return res.status(400).send("Invalid or expired token");
  }

  // Update user password
  // Update user password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Redirect user to login page
  res.send({ sucess: true });

}