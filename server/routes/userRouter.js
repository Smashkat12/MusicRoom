const express = require("express");
const passport = require("passport")
const userHandler = require("../controllers/user");

const { registerValidation } = require("../utils/utils");

exports.router = (() => {
  const userRouter = express.Router();
  
  userRouter.get("/", userHandler.getUsers);


  userRouter.get("/:id", userHandler.getUserById);

  //POST
  // register new user
  //http://localhost:5000/api/user/register
  userRouter.post("/register", passport.authenticate("register",),registerValidation, userHandler.postUser);


  

  userRouter.delete(
    "/user",
    passport.authenticate("jwt", { session: false }),
    userHandler.delUserById
  );
  
  userRouter.put(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    userHandler.putUserById
  );


  userRouter.get("/:username", userHandler.getUserByUsername);
  
  userRouter.post("/avatar", userHandler.postAvatar);

  return userRouter;
})();
