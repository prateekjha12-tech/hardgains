require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { connectDB } = require("./db");

exports.handler = async function (event) {
  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email and password required" }),
      };
    }

    const client = await connectDB();
    const db = client.db("fitnessstreams");
    const users = db.collection("users");

    const user = await users.findOne({ email: email.toLowerCase() });

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid email or password" }),
      };
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid email or password" }),
      };
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Login successful",
        token,
        user: {
          name: user.name,
          email: user.email,
          profilePic: user.profilePic || "",
        },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Login failed", error: error.message }),
    };
  }
};