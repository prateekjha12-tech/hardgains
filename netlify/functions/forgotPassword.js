require("dotenv").config();

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { connectDB } = require("./db");

exports.handler = async function (event) {
  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email is required" }),
      };
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "EMAIL_USER or EMAIL_PASS missing in .env",
        }),
      };
    }

    const client = await connectDB();
    const db = client.db("fitnessstreams");
    const users = db.collection("users");

    const user = await users.findOne({ email: email.toLowerCase() });

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No account found with this email" }),
      };
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await users.updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          resetToken: token,
          resetTokenExpiry: expiry,
        },
      }
    );

    const resetLink = `${process.env.SITE_URL}/reset-password.html?token=${token}`;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Fitness Streams - Password Reset",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password (valid for 15 minutes):</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Reset link sent successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Server error in forgotPassword",
        error: error.message,
      }),
    };
  }
};