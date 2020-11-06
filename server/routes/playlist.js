const express = require("express");
const passport = require("passport");
const router = express.Router();
const controllerPlaylist = require("../controllers/playlist");

const { playlistTitleValidation } = require("../utils/utils");

/* 
    Create Playlist
*/
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  playlistTitleValidation,
  controllerPlaylist.CreatePlaylist
);
/*
    Get All User Playlist
*/
router.get(
  "/me/all",
  passport.authenticate("jwt", { session: false }),
  controllerPlaylist.GetAllUserPlaylists
);
/*
    Add Tracks to playlist
*/
router.post(
  "/:PId/tracks",
  passport.authenticate("jwt", { session: false }),
  controllerPlaylist.addPlaylistTracks
);
/*
    Get All Playlist Tracks
*/
router.get(
  "/:PId/tracks",
  passport.authenticate("jwt", { session: false }),
  controllerPlaylist.getPlaylistTracks
);
/*
    Get User Playlist with name
*/
router.get("/:name/:userId", controllerPlaylist.GetUserPlaylistWithName);
/* 
    Update Public Playlist
*/
router.get(
  "/update/:playListId/:userId",
  controllerPlaylist.UpdatePublicPlaylist
);
/* 
    Update Private Playlist 
*/
router.post(
  "/updatePrivate/:playListId/:userId",
  controllerPlaylist.UpdatePrivatePlaylist
);
/* 
    Add Music To Playlist
*/
router.post(
  "/update/:playListId/:userId/:newId/:songName",
  controllerPlaylist.AddMusicToPlaylist
);
/* 
    Delete User From Playlist
*/
router.post(
  "/delete/user/:playListId/:userId/:userIdToDelete",
  controllerPlaylist.DeleteUserFromPlaylist
);
/*
    Import Playlist
*/
router.post("/import/list/:userId", controllerPlaylist.ImportPlaylist);

module.exports = router;
