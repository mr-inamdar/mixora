const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const Song = require("../models/Song");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// ========================
// Multer Setup
// ========================
const storage = multer.diskStorage({});
const upload = multer({ storage });

// ========================
// UPLOAD SONG
// ========================
router.post(
  "/upload",
  auth,
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const songFile = req.files?.song?.[0];
      const imageFile = req.files?.image?.[0];

      if (!songFile || !imageFile) {
        return res.status(400).json({ error: "Song and image required" });
      }

      // Upload to Cloudinary
      const songUpload = await cloudinary.uploader.upload(songFile.path, {
        resource_type: "video",
        folder: "songs",
      });

      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        folder: "images",
      });

      const { title, artist, album, urduName, hindiName } = req.body;

      const newSong = await Song.create({
        title,
        artist,
        album,
        urduName,
        hindiName,
        audio_url: songUpload.secure_url,
        image_url: imageUpload.secure_url,
        uploaded_by: req.user.id,
      });

      res.status(201).json({
        message: "Song Uploaded Successfully",
        song: newSong,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload Failed" });
    }
  }
);

// ========================
// GET ALL SONGS
// ========================
router.get("/", async (req, res) => {
  try {
    const songs = await Song.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const formattedSongs = songs.map((song) => ({
      id: song.id,
      englishName: song.title,
      hindiName: song.hindiName,
      urduName: song.urduName,
      artist: song.artist,
      album: song.album,
      img: song.image_url,
      audio: song.audio_url,
      uploadBy: song.User?.username || "Unknown",
      source: "db",
    }));

    res.json(formattedSongs);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================
// GET MY SONGS
// ========================
router.get("/my-songs", auth, async (req, res) => {
  try {
    const songs = await Song.findAll({
      where: {
        uploaded_by: req.user.id,
      },
    });

    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================
// DELETE SONG (OWNER ONLY)
// ========================
router.delete("/:id", auth, async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);

    if (!song) {
      return res.status(404).json({ error: "Song Not Found" });
    }

    // ownership check
    if (song.uploaded_by !== req.user.id) {
      return res.status(403).json({ error: "Not Allowed" });
    }

    await song.destroy();

    res.json({ message: "Song Deleted Successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;