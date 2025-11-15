/*
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../models/users")
const { body, param } = require("express-validator");

dotenv.config();
//change for database?
exports.register = async (req, res) => {
        // Destructure the request body into the expected fields
        const { username, email, passwordHash, password_confirmation } = req.body;
        try {
            // 1. Check if the email already exists in the database
            const existingUser = await User.exists({
                email: email 
            });
            // If a user with the same email exists, return an error response
            if (existingUser) {
                    return res.status(400).send("Email is already in use!")

            }

            // 2. Hash the password using bcrypt to ensure security before storing it in the DB
            const hashedPassword = await bcrypt.hash(passwordHash, 10);

            // 3. Create a new user in the database with hashed password
            const newUser = await User.find({
                data: {
                    username,
                    email,
                    passwordHash: hashedPassword
                }
            });

            // 4. Return a success response with the new user data (excluding password for security)
            return Send.success(res, {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }, "User successfully registered.");

        } catch (error) {
            // Handle any unexpected errors (e.g., DB errors, network issues)
            console.error("Registration failed:", error); // Log the error for debugging
            return Send.error(res, null, "Registration failed.");
        }

    }
exports.loginUser = async (req, res) => {
  const accessToken = jwt.sign(
    {
      email: res.locals.email,
    },
    process.env.ACCESS_SECRET,
    { expiresIn: "10m" }
  );
  res.json({ token: accessToken });
  const refreshToken = jwt.sign(
    {
      email: res.locals.email,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "1d",
    }
  );
  //pro HTTPS secure true, pro http httpOnly na true
  res.cookie("jwt", refreshToken, {
    sameSite: "none",
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  });
  //pro postmana
  return res.json({ accessToken });
};

exports.refresh = async (req, res) => {
  if (!req.cookies.jwt) return res.status(406).json({ msg: "Unauthorized" }); //406 - Not Acceptable
  const refreshToken = req.cookies.jwt;
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(406).json({ msg: "Unauthorized" });
    }
    const accessToken = jwt.sign(
      {
        email: decoded.email,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "10m",
      }
    );
    // Return or use accessToken here
    res.json({ accessToken });
  });
};

exports.verify = async (req, res, next) => {
  //headerauthorization: Bearer token
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(406).send({ msg: "Unauthorized" });
  jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
    if (err) return res.status(403).send({ msg: "Unauthorized" }); //Forbidden access
    res.locals.user = user;
    next();
  });
};
*/