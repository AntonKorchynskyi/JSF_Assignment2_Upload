const express = require("express");
const router = express.Router();
const Playlist = require("../models/playlist");

function IsLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// GET list of playlists
router.get("/", (req, res, next) => {
    Playlist.find((err, data) => {
        res.render("playlists/index", {
            title: "Playlist Record",
            dataset: data,
            user: req.user
        });
    });
});

// GET /ADD
router.get("/add", IsLoggedIn, (req, res, next) => {
    res.render("playlists/add", { title: "Add a new Playlist", user: req.user });
});

// POST /ADD
router.post("/add", IsLoggedIn, (req, res, next) => {
    Playlist.create(
        {
            name: req.body.name,
        },
        (err, newPlaylists) => {
            res.redirect("/playlists");
        }
    );
});

// GET /edit/_id
router.get("/edit/:_id", IsLoggedIn, (req, res, next) => {
    let playlistId = req.params._id;
    Playlist.findById(playlistId, (err, playlistData) => {
        res.render("playlists/edit", {
          title: "Edit Playlist Info",
          playlist: playlistData, 
          user: req.user 
        });
    });
});
  
// POST /edit/_id
router.post("/edit/:_id", IsLoggedIn, (req, res, next) => {
    let playlistId = req.params._id;
    Playlist.findOneAndUpdate(
        { _id: playlistId }, // filter to find the playlist to update
        {
            // updated data
            name: req.body.name,
        },
        (err, updatedPlaylist) => {
            if (err) { console.log(err); }
            else { res.redirect("/playlists"); }
        }
    );
});

// GET /delete/_id
// access parameters via req.params object
router.get("/delete/:_id", IsLoggedIn, (req, res, next) => {
    let playlistId = req.params._id;
    Playlist.remove({ _id: playlistId }, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/playlists");
        }
    });
});

module.exports = router;