const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = (req, res) => {
  const accessToken = jwt.sign(
    {
      email: res.locals.email,
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "10m",
    }
  );
  const refreshToken = jwt.sign(
    {
      email: res.locals.email,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "1d",
    }
  );

  //pro HTTPS secure, httpOnly na true
  /*res.cookie("jwt", refreshToken, {
    sameSite: "none",
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  });*/
  return res.json({ accessToken });
};

// Middleware to protect routes
exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });
  try {
    // Verify the token
    const verified = jwt.verify(token.split(" ")[1], process.env.ACCESS_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.log("TOKEN EXTRACTED:", token);
    res.status(400).json({ message: `Invalid token ${err}` });
  }
};

