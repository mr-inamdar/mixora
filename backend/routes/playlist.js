const router = require("express").Router();
const Playlist = require("../models/Playlist"); //[cite: 18]
const Song = require("../models/Song");
const auth = require("../middleware/authMiddleware");

// Create Playlist[cite: 18]
router.post("/create", auth, async (req, res) => {
  try {
    const { name } = req.body;
    const playlist = await Playlist.create({
      name,
      owner_id: req.user.id
    });
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Song To Playlist (Optimized & Cleaned)[cite: 18]
router.post("/add", auth, async (req, res) => {
  try {
    const { songId } = req.body;

    const playlist = await Playlist.findOne({
      where: { owner_id: req.user.id }
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found for this user." });
    }

    const song = await Song.findByPk(songId);
    if (!song) {
      return res.status(404).json({ error: "Song target instance not found." });
    }

    // Duplicate entries safety mechanism
    const alreadyExists = await playlist.hasSong(song);
    if (alreadyExists) {
      return res.status(400).json({ message: "Song already added to this playlist." });
    }

    await playlist.addSong(song);
    res.json({ success: true, message: "Song mapped to playlist successfully." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Processing Error" });
  }
});

// Remove Song[cite: 18]
router.delete("/remove/:songId", auth, async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      where: { owner_id: req.user.id }
    });

    if (!playlist) return res.status(404).json({ error: "Playlist not found" });

    const song = await Song.findByPk(req.params.songId);
    if (!song) return res.status(404).json({ error: "Song not found" });

    await playlist.removeSong(song);
    res.json({ success: true, message: "Song detached from playlist." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get My Playlist with attached Songs[cite: 18]
router.get("/my", auth, async (req, res) => {
  try {
    // const playlist = await Playlist.findOne({
    //   where: { owner_id: req.user.id },
    //   include: [{ model: Song, through: { attributes: [] } }] // Hides junction meta details clean array raw response ke liye
    // });

    const playlist = await Playlist.findOne({
      where: { owner_id: req.user.id },
      include: [{
        model: Song,
        attributes: [
          "id",
          ["title", "englishName"],
          "artist",
          "album",
          ["audio_url", "audio"],
          ["image_url", "img"],
          "hindiName",
          "urduName",
          ["uploaded_by", "uploadBy"]
        ]
      }]
    });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; //[cite: 18]