const express = require("express");
const router = express.Router();
const controllerRoom = require("../controllers/room");

//Call routes
/*
    Create Room
*/
router.post("/room/create", controllerRoom.create);
/*
    All Rooms
*/
router.get("/room/all/:userId/:lat/:long", controllerRoom.GetAllRooms);
/* 
    Room Name
*/
router.get("/room/:name", controllerRoom.RoomName);
/* 
    Update Private Room
*/
router.post("/room/update/:roomId/:userId", controllerRoom.PublicRoomUpdate);
/* 
    Update Private Room
*/
router.post("/room/update/:roomId/:userId/:newId/:songName", controllerRoom.PrivateRoomUpdate);
/*
    Update room
*/
router.put("/room/update/:roomId/:userId/:newId/:songName", controllerRoom.AddToMusicList);
/*

*/
router.put("/room/delete/user/:roomId/:userId/:userIdToDelete", controllerRoom.DeleteUser);
module.exports =  router;