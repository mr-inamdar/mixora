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

    // res.json({
    //   token,
    //   user
    // });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

    // const token = jwt.sign(
    //   { id: user.id },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "7d" }
    // );

    // res.json({
    //   token,
    //   user: {
    //     id: user.id,
    //     username: user.username,
    //     email: user.email
    //   }
    // });

  } catch (err) {
    res.status(500).json(err);
  }

});

const authMiddleware = require("../middleware/authMiddleware");

router.delete("/delete-account", authMiddleware, async (req, res) => {

  console.log("DELETE ROUTE HIT");

  return res.json({ message: "Route reached" });

  try {
    console.log("User from token:", req.user);

    const userId = req.user.id;
    console.log("Deleting user:", userId);

    const deleted = await User.destroy({
      where: { id: userId }
    });

    console.log("Deleted rows:", deleted);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

// router.delete("/delete-account", authMiddleware, async (req, res) => {

//   const t = await sequelize.transaction();

//   try {

//     const userId = req.user.id;

//     const playlist = await Playlist.findOne({
//       where: {
//         owner_id: userId
//       },
//       transaction: t
//     });

//     if (playlist) {
//       await playlist.setSongs([], {
//         transaction: t
//       });
//     }

//     await Playlist.destroy({
//       where: {
//         owner_id: userId
//       },
//       transaction: t
//     });

//     // await Song.destroy({
//     //   where: {
//     //     uploaded_by: userId
//     //   },
//     //   transaction: t
//     // });

//     await User.destroy({
//       where: {
//         id: userId
//       },
//       transaction: t
//     });

//     await t.commit();

//     res.json({
//       success: true
//     });

//   } catch (err) {

//     await t.rollback();

//     console.log(err);

//     res.status(500).json({
//       error: "Delete Failed"
//     });

//   }

// });

module.exports = router;