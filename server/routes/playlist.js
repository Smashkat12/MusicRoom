const express = require("express");
const router = express.Router();
const controllerPlaylist = require("../controllers/playlist");;

/* 
    Create Playlist
*/
router.post("/playlist/create", controllerPlaylist.CreatePlaylist);
/*
    Get All User Playlist
*/
router.get("/playlist/all/:userId", controllerPlaylist.GetAllUserPlaylists);
/*
    Get User Playlist with name
*/
router.get("/playlist/:name/:userId", controllerPlaylist.GetUserPlaylistWithName);
/* 
    Update Public Playlist
*/
router.get("/playlist/update/:playListId/:userId", controllerPlaylist.UpdatePublicPlaylist);
/* 
    Update Private Playlist 
*/
router.post("/playlist/updatePrivate/:playListId/:userId", controllerPlaylist.UpdatePrivatePlaylist);
/* 
    Add Music To Playlist
*/
router.post("/playlist/update/:playListId/:userId/:newId/:songName", controllerPlaylist.AddMusicToPlaylist);
/* 
    Delete User From Playlist
*/
router.post("/playlist/delete/user/:playListId/:userId/:userIdToDelete", controllerPlaylist.DeleteUserFromPlaylist);
/*
    Import Playlist
*/
router.post("/playlist/import/list/:userId", controllerPlaylist.ImportPlaylist);