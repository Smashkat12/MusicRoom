const nodemailer = require("nodemailer");
const passport = require("passport");
const chalk = require("chalk");
const { v4: uuidv4 } = require("uuid");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const keys = require("../config/keys");
const { validationResult } = require("express-validator");
const { generateServerError } = require("../utils/utils");

module.exports = {
  isAuthenticated: (req, res) => {
    if (req.isAuthenticated())
      res.status(200).json({ code: 200, auth: true, user: req.user });
    else res.status(401).json({ code: 401, auth: false });
  },

  logout: (req, res) => {
    req.logout();
    res.json({ disconnected: true });
  },

  connect: (req, res) => {
    if (req.user) {
      const payload = {
        _id: req.user._id,
        username: req.user.username,
      };

      JWT.sign(payload, keys.JWT.secret, { expiresIn: "1d" }, (err, token) => {
        res.redirect(`http://localhost:8080/login?token=Bearer ${token}`);
      });
    } else {
      res.redirect("http://localhost:8080/login");
    }
  },

  strategy: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const resStatusCode = 400;
      const fullError = { success: false, errors: errors.array() };
      const message = "Input validation error";
      return generateServerError(res, resStatusCode, fullError, message);
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        const resStatusCode = 500;
        const fullError = { success: false, errors: err.array() };
        const message = "Something went wrong in server";
        return generateServerError(res, resStatusCode, fullError, message);
      }

      if (!user) {
        return res
          .status(404)
          .json({ code: 404, success: false, message: info.message });
      } else {
        const payload = {
          _id: user._id,
          username: user.username,
        };

        JWT.sign(
          payload,
          keys.JWT.secret,
          { expiresIn: "1d" },
          (err, token) => {
            res.status(200).send({
              code: 200,
              success: true,
              token: `Bearer ${token}`,
              message: "Login sucessful",
            });
          }
        );
      }
    })(req, res, next);
  },

  confirm: (req, res) => {
    const key = req.body.key;
    User.findOneAndUpdate(
      { confirmKey: key },
      { confirmKey: "confirmed" },
      (err, user) => {
        if (err) return res.json({ success: false, error: err });
        else if (user) return res.json({ success: true });
        else return res.json({ success: false });
      }
    );
  },

  forgotInitiate: (req, res) => {
    const forgotKey = uuidv4();
    const forgotLink = `http://localhost:8080/forgot/${forgotKey}`;

    User.findOneAndUpdate(
      { email: req.body.email },
      { forgotKey: forgotKey },
      { new: true },
      (err, model) => {
        if (err) {
          res.json({ success: false, error: err });
        } else if (model) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: "musicroom811@gmail.com",
              pass: "Music@123",
            },
          });
          const message = `Hello,
          <p>It has come to our attention that you forgot to your password.  click on the link below to reset the password.</p>
          <p><a href="${forgotLink}" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:20px;color:#FFFFFF;border-style:solid;border-color:#7BA9F7;border-width:15px 25px;display:inline-block;background:#7BA9F7;border-radius:2px;font-weight:normal;font-style:normal;line-height:24px;width:auto;text-align:center;">Reset password</a></p>
        `;

          const mailOptions = {
            from: "musicroom811@gmail.com",
            to: model.email,
            subject: "Music Room - Password Reset",
            html: message,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(chalk.bold.redBright("Email error: "), error);
            } else {
              console.log(
                chalk.bold.greenBright("Email sent: "),
                info.response
              );
              res.json({ success: true, updated: model });
            }
          });
        } else {
          res.json({ success: false, status: "Mail not found" });
        }
      }
    );
  },

  forgotConfirmKey: (req, res) => {
    User.find({ forgotKey: req.params.key }, (err, result) => {
      if (err) {
        res.json({ success: false, error: err });
      } else if (result.length > 0) {
        res.json({ success: true, user: result });
      } else {
        res.json({ success: false, status: "not_found" });
      }
    });
  },

  forgotPasswordChange: (req, res) => {
    const updateQuery = {
      forgotKey: "",
      password: bcrypt.hashSync(req.body.password, 10),
    };

    User.findOneAndUpdate(
      { forgotKey: req.params.key },
      updateQuery,
      (err, user) => {
        if (err) res.json({ success: false, error: err });
        else if (user) res.json({ success: true });
        else res.json({ success: false });
      }
    );
  },
};
