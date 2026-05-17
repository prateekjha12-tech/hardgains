require("dotenv").config();
const { MongoClient } = require("mongodb");

exports.handler = async function () {
  try {
    // DEBUG CHECK
    if (!process.env.MONGO_URI) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "❌ MONGO_URI not found in environment variables",
          hint: "Check .env file and restart netlify dev"
        })
      };
    }

    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ MongoDB Connected Successfully!"
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "❌ MongoDB Connection Failed",
        error: error.message
      })
    };
  }
};