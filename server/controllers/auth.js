const nodemailer = require("nodemailer");
const passport = require("passport");
const chalk = require("chalk");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports = {
  isAuthenticated: (req, res) => {
    if (req.isAuthenticated()) res.json({ auth: true, user: req.user });
    else res.json({ auth: false });
  },

  logout: (req, res) => {
    req.logout();
    res.json({ disconnected: true });
  },

  strategy: (req, res, next) => {
    const strategy = req.params.strategy;
    if (strategy === "local") {
      passport.authenticate("local", (err, user, info) => {
        req.login(user, (err) => {
          if (err) {
            res.json({ success: false, status: info.message });
          } else if (user) {
            res.json({
              success: true,
              status: "Authentication success",
              user: req.user,
            });
          } else {
            res.json({ success: false, status: info.message });
          }
        });
      })(req, res, next);
    } else {
      res.json({
        success: false,
        status: "Authentication failed, strategy error",
      });
    }
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
