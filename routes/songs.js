const express = require("express");
var path = require('path');
const router = express.Router();
const Song = require("../models/song");
const Playlist = require("../models/playlist");
// for uploading and downloading the song file
const multer = require('multer');

// Upload and download part start (done with the help of ChatGPT for learning purposes)
// Set up storage for multer
// "storage" is used to specfy where files should be uploaded to and it can optionally be used to specify 
// the filename of the saved uploaded file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// file filter function
const fileFilter = (req, file, cb) => {
  // Check if the file type is mp3
  // MIME type is similar to the file extension as it also identifies the file content
  if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only MP3 files are allowed.'), false); // Reject the file, throws error which also logs the person out
  }
};

// this const includes storage created earlier and the new fileFilter field (which checks each received file)
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

// Example route for handling form submission with file upload
// upload.single() <- uses provided const to deal with the file based on the provided 'filename' argument
router.post('/upload', IsLoggedIn, upload.single('filename'), (req, res) => {
  // req.file contains information about the uploaded file
  // req.body contains other form fields
  console.log(req.file);
  console.log(req.body);

  res.send('File uploaded!');
});
//upload part end

// downloading the file
router.get("/download/:_id", (req, res, next) => {
  let songId = req.params._id;
  Song.findById(songId, (err, songData) => {
    if (err) {
      console.log(err);
      return;
    }

    // creates filepath by joining the file location with its name (based on chosen song)
    let filePath = path.join(__dirname, '../public/uploads', songData.filename);

    // Send the file for download based on the provided path and speciifed filename
    res.download(filePath, songData.filename, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
});
// download and upload part end

function IsLoggedIn(req,res,next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
}

// GET list of songs
router.get("/", (req, res, next) => {
  Song.find((err, songs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("songs/index", {
        title: "Song List",
        dataset: songs,
        user: req.user,
      });
    }
  });
});

// GET /add
router.get("/add", IsLoggedIn, (req, res, next) => {
  Playlist.find((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.render("songs/add", {
        title: "Add a New Song",
        playlists: data, 
        user: req.user 
      });
    }
  });
});

// POST /add
router.post("/add", IsLoggedIn, upload.single('filename'), (req, res, next) => {
  Song.create(
    {
      name: req.body.name,
      genre: req.body.genre,
      singer: req.body.singer,
      playlist: req.body.playlist,
      filename: req.file.filename,
    },
    (err, newSong) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/songs");
      }
    }
  );
});

// GET /edit/_id
router.get("/edit/:_id", IsLoggedIn, (req, res, next) => {
  let songId = req.params._id;
  Song.findById(songId, (err, songData) => {
    Playlist.find((err, playlistData) => {
      res.render("songs/edit", {
        title: "Edit Song Info",
        song: songData,
        playlists: playlistData, 
        user: req.user 
      });
    });
  });
});

// POST /edit/_id
router.post("/edit/:_id", IsLoggedIn, (req, res, next) => {
  let songId = req.params._id;
  Song.findOneAndUpdate(
    { _id: songId }, // filter to find the song to update
    {
      // updated data
      name: req.body.name,
      genre: req.body.genre,
      singer: req.body.singer,
      playlist: req.body.playlist,
    },
    (err, updatedSong) => {
        if (err) { console.log(err); }
        else { res.redirect("/songs"); }
    }
  );
});

// GET /delete/_id
// access parameters via req.params object
router.get("/delete/:_id", IsLoggedIn, (req, res, next) => {
  let songId = req.params._id;
  Song.remove({ _id: songId }, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/songs");
    }
  });
});

module.exports = router;