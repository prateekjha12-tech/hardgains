
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB } = require("./db");

exports.handler = async function (event) {
  try {
    const { token, newPassword } = JSON.parse(event.body);

    if (!token || !newPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Token and new password required" })
      };
    }

    if (newPassword.length < 6) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Password must be at least 6 characters" })
      };
    }

    const client = await connectDB();
    const db = client.db("fitnessstreams");
    const users = db.collection("users");

    const user = await users.findOne({ resetToken: token });

    if (!user) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid reset token" })
      };
    }

    if (new Date() > new Date(user.resetTokenExpiry)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Reset token expired" })
      };
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await users.updateOne(
      { resetToken: token },
      {
        $set: { password: hashed },
        $unset: { resetToken: "", resetTokenExpiry: "" }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Password updated successfully" })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Reset failed", error: error.message })
    };
  }
};