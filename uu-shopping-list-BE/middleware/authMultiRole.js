//examplee

const authMultiRole = (roles) => {
  return async (req, res, next) => {
    try {
      const bearerString = req.headers["authorization"];
      const token = bearerString.split(" ")[1];
      //db user find
      //db user role
      let userRole = "pleb";
      if (roles.includes(userRole)) return next();
      res.status(403).send({
        msg: "Its for biden",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Server error during authorization" });
    }
  };
};

module.exports = authMultiRole;
