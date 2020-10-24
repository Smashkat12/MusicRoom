const express = require("express");
const authHandler = require("../controllers/auth");
const passport = require("passport");
const { loginValidation } = require("../utils/utils");

//authRouter
exports.router = (() => {
  const authRouter = express.Router();
  /**
   * @api {GET} /api/auth Check user auth status
   * @apiName isAuthenticated
   * @apiGroup Authentication
   *
   * @apiDescription Checks if current user is authenticated
   *
   * @apiSuccess {Boolean} auth authenticated status.
   * @apiSuccess {Object} user user object from bd.
   */
  authRouter.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    authHandler.isAuthenticated
  );

  /**
   * @api {GET} /api/auth/logout Ends user session
   * @apiName logout
   * @apiGroup Authentication
   *
   * @apiDescription Logs user out
   *
   * @apiSuccess {Boolean} disconnected true if user session terminated.
   */

  authRouter.get("/logout", authHandler.logout);

  /**
   * @api {POST} /api/auth/login/:strategy Authenticates user
   * @apiName Login
   * @apiGroup Authentication
   *
   * @apiDescription Authenticates user via a passport strategy
   *
   * @apiParam {String} strategy  passport strategy to authenticate via (local, google, facebook)
   *
   * @apiSuccess {Boolean} success true if user successfully authenticated.
   * @apiSuccess {String} status describes authentication status.
   * @apiSuccess {Object} user user data from DB.
   */

  authRouter.post("/login", loginValidation, authHandler.strategy);

  authRouter.get(
    "/login/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  );

  authRouter.get(
    "/login/facebook/callback",
    passport.authenticate("facebook", {
      session: false,
    }),
    authHandler.connect
  );

  authRouter.get(
    "/login/google",
    passport.authenticate("google", {
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    })
  );

  authRouter.get(
    "/login/google/callback",
    passport.authenticate("google", {
      session: false,
    }),
    authHandler.connect
  );
  authRouter.post("/confirm", authHandler.confirm);

  authRouter.post("/forgot", authHandler.forgotInitiate);

  authRouter.get("/forgot/:key", authHandler.forgotConfirmKey);

  authRouter.post("/forgot/:key", authHandler.forgotPasswordChange);

  return authRouter;
})();
