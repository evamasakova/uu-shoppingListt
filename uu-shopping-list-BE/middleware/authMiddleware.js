const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/users"); // adjust path

require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const { email, passwordHash } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ message: "Invalid credentials - doesn't exist" });
    const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_SECRET,
      { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.REFRESH_SECRET,
      { expiresIn: "1d" }
    );

    /**
     * Production:
     * sameSite: none
     * secure: true
     * httpOnly: true
     *
     * Dev:
     * sameSite: lax
     * secure: false
     * httpOnly: true
     */
    res.cookie("jwt", refreshToken, {
      sameSite: "lax",
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyToken = (req, res, next) => {
  const tokenHeader = req.header("Authorization");
  if (!tokenHeader) return res.status(401).json({ message: "Access Denied" });

  const token = tokenHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = verified;
    return next();
  } catch (err) {
    //if access token is expired - refreshes access token with refresh token
    if (err.name === "TokenExpiredError") {
      return refreshAccessToken(req, res); 
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) return res.status(401).json({ msg: "Unauthorized" });

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Unauthorized" });

    const accessToken = jwt.sign(
      { email: decoded.email, id: decoded.id },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "10m",
      }
    );

    return res.status(200).json({ accessToken });
  });
};

exports.refresh = refreshAccessToken;
