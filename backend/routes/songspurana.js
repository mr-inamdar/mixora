const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Song = require("../models/Song"); // Sequelize Model import kiya
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

// Multer Setup (Temporary storage file aane par)
const storage = multer.diskStorage({});
const upload = multer({ storage });

// UPLOAD SONG API
router.post(
  "/upload",
  auth, // JWT Token verify karega
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      // 1. Cloudinary par Song aur Image upload karo
      const songUpload = await cloudinary.uploader.upload(req.files.song[0].path, {
        resource_type: "video", // audio/video dono ke liye video use hota hai
        folder: "songs",
      });

      const imageUpload = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: "images",
      });

      // 2. Frontend FormData se saara data nikalo 👇
      const { title, artist, album, urduName, hindiName } = req.body;

      // 3. Database me Save karo (Sequelize ORM magic ✨)
      const newSong = await Song.create({
        title: title,
        artist: artist,
        album: album,             // Tumhara naya field
        urduName: urduName,       // Tumhara naya field
        hindiName: hindiName,     // Tumhara naya field
        audio_url: songUpload.secure_url,
        image_url: imageUpload.secure_url,
        uploaded_by: req.user.id  // Token se aaya hua user id
      });

      res.status(201).json({ 
        message: "Song Uploaded Successfully", 
        song: newSong 
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload Failed" });
    }
  }
);

// // GET ALL SONGS
// router.get("/", async (req, res) => {
//   try {
//     const songs = await Song.findAll(); // Sequelize se saare songs fetch
//     res.json(songs);
//   } catch (err) {
//     res.status(500).json({ error: "Could not fetch songs" });
//   }
// });

// router.get("/", async (req, res) => {

//   const songs = await Song.findAll();

//   const formattedSongs = songs.map(song => ({
//     id: song.id,
//     englishName: song.title,
//     hindiName: song.hindiName,
//     urduName: song.urduName,
//     artist: song.artist,
//     album: song.album,
//     img: song.image_url,
//     audio: song.audio_url,
//     uploadBy: song.uploaded_by,
//     source: "db"
//   }));

//   res.json(formattedSongs);

// });

router.get("/", async (req, res) => {

  const songs = await Song.findAll({
    include: [{
      model: User,
      attributes: ["username"]
    }]
  });

  const formattedSongs = songs.map(song => ({
    id: song.id,
    englishName: song.title,
    hindiName: song.hindiName,
    urduName: song.urduName,
    artist: song.artist,
    album: song.album,
    img: song.image_url,
    audio: song.audio_url,

    // ID ki jagah username
    uploadBy: song.User?.username || "Unknown",

    source: "db"
  }));

  res.json(formattedSongs);

});

// app.delete("/songs/:id", verifyToken, async (req, res) => {
//   try {
//     const songId = req.params.id;

//     const song = await Song.findById(songId);

//     if (!song) {
//       return res.status(404).json({ message: "Song not found" });
//     }

//     // check ownership
//     if (song.uploaded_by.toString() !== req.user.id) {
//       return res.status(403).json({
//         message: "You are not allowed to delete this song",
//       });
//     }

//     await Song.findByIdAndDelete(songId);

//     res.json({ message: "Song deleted successfully" });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded; // { id: userId }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const token = req.headers.authorization;

if (!token) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized"
  });
}

router.get("/my-songs", auth, async (req,res)=>{

  const songs = await Song.findAll({
    where:{
      uploaded_by:req.user.id
    }
  });

  res.json(songs);

});

// router.get("/search/:query", async (req,res)=>{

//   const songs = await Song.findAll();

//   const filtered = songs.filter(song =>
//     song.title
//       .toLowerCase()
//       .includes(req.params.query.toLowerCase())
//   );

//   res.json(filtered);

// });

router.delete("/:id", auth, async (req,res)=>{

  try{

    const song = await Song.findByPk(
      req.params.id
    );

    if(!song){

      return res.status(404).json({
        error:"Song Not Found"
      });

    }

    if(song.uploaded_by !== req.user.id){

      return res.status(403).json({
        error:"Not Allowed"
      });

    }

    await song.destroy();

    res.json({
      message:"Song Deleted"
    });

  }catch(err){

    res.status(500).json(err);

  }

});

// app.post("/upload-song", async (req, res) => {
//   const { uploaded_by } = req.body;

//   if (!uploaded_by) {
//     return res.status(401).json({
//       success: false,
//       message: "Please login first"
//     });
//   }

//   // Upload logic
//   res.json({
//     success: true,
//     message: "Song uploaded successfully"
//   });
// });

module.exports = router;