require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB } = require("./db");

exports.handler = async function (event) {
  try {
    const { name, email, password } = JSON.parse(event.body);

    if (!name || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "All fields required" }),
      };
    }

    if (password.length < 6) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Password must be at least 6 characters" }),
      };
    }

    const client = await connectDB();
    const db = client.db("fitnessstreams");
    const users = db.collection("users");

    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "Email already exists" }),
      };
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashed,
      profilePic: "",
      createdAt: new Date(),
    };

    await users.insertOne(newUser);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Signup successful" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Signup failed", error: error.message }),
    };
  }
};