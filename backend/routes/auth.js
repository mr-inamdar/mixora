const router = require("express").Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Playlist = require("../models/Playlist");
const Song = require("../models/Song");

router.post("/register", async (req, res) => {

  try {

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hash
    });

    await Playlist.create({
      name: "My Playlist",
      owner_id: user.id
    });


    res.status(201).json({
      message: "User Registered",
      user
    });

  } catch (err) {
    res.status(500).json(err);
  }

});

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        error: "User Not Found"
      });
    }

    const valid = await bcrypt.compare(
      password,
      user.password
    );

    if (!valid) {
      return res.status(400).json({
        error: "Wrong Password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d"
      }
    );

    res.json({
      token,
      user
    });

  } catch (err) {
    res.status(500).json(err);
  }

});

module.exports = router;