const router = require("express").Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { sequelize } = require("../config/db");

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


    // res.status(201).json({
    //   message: "User Registered",
    //   user
    // });

    const token = jwt.sign(
  { id: user.id },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

  res.status(201).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
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

    // const token = jwt.sign(
    //   {
    //     id: user.id,
    //     email: user.email
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "30d"
    //   }
    // );

    // res.json({
    //   token,
    //   user
    // });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json(err);
  }

});

const auth = require("../middleware/authMiddleware");

router.delete("/delete-account", auth, async (req, res) => {

  const t = await sequelize.transaction();

  try {

    const userId = req.user.id;

    const playlists = await Playlist.findOne({
      where: {
        owner_id: userId
      },
      transaction: t
    });

    for (const playlist of playlists) {

      await playlist.setSongs([], {
        transaction: t
      });

    }

    await Playlist.destroy({
      where: {
        owner_id: userId
      },
      transaction: t
    });

    await Song.destroy({
      where: {
        uploaded_by: userId
      },
      transaction: t
    });

    await User.destroy({
      where: {
        id: userId
      },
      transaction: t
    });

    await t.commit();

    res.json({
      success: true
    });

  } catch (err) {

    await t.rollback();

    console.log(err);

    res.status(500).json({
      error: "Delete Failed"
    });

  }

});

module.exports = router;