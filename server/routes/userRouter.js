const express = require("express");
const userHandler = require("../controllers/user");


exports.router = (() => {
  const userRouter = express.Router();

  //GET
  //gets all user documents
  //http://localhost:5000/api/users
  userRouter.get("/", userHandler.getUsers);

  //GET
  //gets a user document
  //http://localhost:5000/api/users/user
  userRouter.get("/user", userHandler.getUserById);

  //POST
  // creates a user document
  //http://localhost:5000/api/users/user
  userRouter.post("/user", userHandler.postUser);

  //DELETE
  // deletes a user document
  //http://localhost:5000/api/users/user
  userRouter.delete("/user", userHandler.delUserById);
  //PUT
  // edits a user document
  //http://localhost:5000/api/users/user
  userRouter.put("/user", userHandler.putUserById);

  //GET
  // gets a user document by username
  //http://localhost:5000/api/users/user/:username
  userRouter.get("/user/:username", userHandler.getUserByUsername);
  //POST
  // upload avatar (profile pic)
  //http://localhost:5000/api/users/user/avatar
  userRouter.post("/user/avatar", userHandler.postAvatar);

  return userRouter;
})();
