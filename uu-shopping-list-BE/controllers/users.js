const UserDAO = require("../dao/users.dao");
const { genSalt, hash, compare } = require("bcrypt");

exports.createUserHandler = async (req, res) => {
  try {
    const { name, username, email, passwordHash, createdLists, memberLists } =
      req.body;
    // check if user exists
    const existing = await new UserDAO().findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ msg: "User already exists!" });
    }
    // hash password
    const salt = await genSalt(10);
    const passwordHashed = await hash(passwordHash, salt);
    // create  thee user
    const createdUser = await new UserDAO().createUser({
      name,
      username,
      email,
      passwordHash: passwordHashed,
      createdLists,
      memberLists,
    });
    if (!createdUser) {
      return res.status(500).json({ msg: "Something went wrong!" });
    }

    res.status(201).json({
      msg: "User created",
      payload: createdUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error });
  }
};
exports.loginUserHandler = async (req, res, next) => {
  try {
    const { email, passwordHash } = req.body;
    if (!email || !passwordHash)
      return res.status(400).send({ msg: "Missing details!" });
    const user = await new UserDAO().findOne({ where: { email: email } });
    if (!user) return res.status(404).send({ msg: "User not found!" });
    const logged = await compare(passwordHash, user.passwordHash);
    if (logged) {
      res.locals.email = email;
      next();
    } else {
      return res.status(401).send({ msg: "Wrong password or email!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
