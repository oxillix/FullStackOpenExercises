const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

const checkUserExists = async (username) => {
  return await User.exists({ "username": username });
};

usersRouter.post("/", async (request, response) => {
  const { username, password, name} = request.body;

  if (!(username && password)) {
    return response
      .status(400)
      .json({ error: "Both username and password must be given." });
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: "Both username and password must be at least 3 characters long.",
    });
  }

  if (checkUserExists(username)) {
    return response.status(400).json({
      error: "The username must be unique.",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

module.exports = usersRouter;
