require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { sequelize, connectDB } = require("./config/db");

// Load Models
require("./models/User");
require("./models/Song");
require("./models/Playlist");

const app = express();
// 👇 Yahan add karo
app.use(cors({
  origin: [
    "http://localhost:5001",
    "https://mixora-v3cw.onrender.com"
  ],
  credentials: true
}));
// app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/songs", require("./routes/songs"));
app.use("/playlist", require("./routes/playlist"));

const startServer = async () => {

  try {

    await connectDB();

    // await sequelize.sync();
    await sequelize.sync();

    console.log("✅ Models Synced");

    // await importDefaultSongs();

    console.log("✅ Default Songs Imported");

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {

      console.log(
        `🚀 Server Running On Port ${PORT}`
      );

    });

  } catch (err) {

    console.log(err);

  }

};

startServer();
