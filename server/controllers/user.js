const User = require("../models/user");

const nodemailer = require("nodemailer");
const chalk = require("chalk");
const bcrypt = require("bcryptjs");

const { generateServerError } = require("../utils/utils");

module.exports = {
  //gets all users
  getUsers: (req, res) => {
    User.find({}, (err, users) => {
      if (err) res.json({ success: false });
      else res.json({ success: true, users: users });
    });
  },
  //registers a user & sends email confirmation

  postUser: (req, res) => {
    if (req.user) {
      const confirmationLink = `http://localhost:8080/confirm/${req.user.confirmKey}`;

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

      const message = `Welcome, <strong>${req.body.username}</strong>
    <p>We're glad to see you on Music Room, in order to start using our platform, we need to confirm that you've entered the right e-mail on the signup form.</p>
    <p>Click on the button below to confirm your email, your account will be activated and you will be able to navigate on the Music Room platform.</p>
    <p>See you soon on Music Room !<br></p>
    <p><a href="${confirmationLink}" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:20px;color:#FFFFFF;border-style:solid;border-color:#7BA9F7;border-width:15px 25px;display:inline-block;background:#7BA9F7;border-radius:2px;font-weight:normal;font-style:normal;line-height:24px;width:auto;text-align:center;">Activate account</a></span></td></tr></table></td></tr></table></td></tr></table></td></tr></table><table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"><tr style="border-collapse:collapse;"><td align="center" style="padding:0;Margin:0;"></p>
	`;

      const mailOptions = {
        from: "musicroom811@gmail.com",
        to: req.user.email,
        subject: "Music Room - Email verification",
        html: message,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
		  console.log(chalk.bold.redBright("Email error: "), error);
		  
        }
        console.log(chalk.bold.greenBright("Email sent: "), req.user.email);
        return res.status(201).send({
          code: 201,
          success: true,
          message: "user successfully registered",
        });
      });
    }
  },

  //gets a specific user by ID
  getUserById: (req, res) => {
    User.find({ _id: req.user._id }, (err, user) => {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({ success: true, user: user });
      }
    });
  },

  //delete a specfic user by ID
  delUserById: (req, res) => {
    User.findOneAndRemove({ _id: req.user._id }, (err) => {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({ success: true });
      }
    });
  },

  //update specific user by ID
  putUserById: (req, res) => {
    const updateQuery = {};

    if (req.body.firstname) updateQuery.firstname = req.body.firstname;
    if (req.body.lastname) updateQuery.lastname = req.body.lastname;
    if (req.body.username) updateQuery.username = req.body.username;
    if (req.body.password)
      updateQuery.password = bcrypt.hashSync(req.body.password, 10);
    if (req.body.avatar) updateQuery.avatar = req.body.avatar;

    if (req.body.birthdate) updateQuery.birthdate = req.body.birthdate;

    if (req.body.age) updateQuery.age = req.body.age;
    if (req.body.gender) updateQuery.gender = req.body.gender;
    if (req.body.language) updateQuery.language = req.body.language;
    if (req.body.email) updateQuery.email = req.body.email;

    User.find({ _id: req.user._id }, (err, user) => {
      if (err) {
        return res.json({ success: false });
      } else if (!user || !err) {
        User.findOneAndUpdate(
          { _id: req.user._id },
          updateQuery,
          { upsert: true },
          (err, user) => {
            if (err) return res.json({ success: false });
            else {
              return res.json({ success: true, updated: user });
            }
          }
        );
      }
    });
  },

  //get user by username
  getUserByUsername: (req, res) => {
    User.find({ username: req.params.username }, (err, user) => {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({ success: true, user: user });
      }
    });
  },

  //add avatar
  postAvatar: (req, res) => {
    if (req.files && req.files.file) {
      const imageFile = req.files.file;
      imageFile.mv(`public/avatars/${req.user._id}.jpg`, (err) => {
        if (err) {
          console.log(err);
          res.json({ success: false, error: err });
        } else {
          User.findOneAndUpdate(
            { _id: req.user._id },
            {
              avatar: `http://localhost:5000/public/uploads/temp/${req.user._id}.jpg`,
            },
            (err, doc, result) => {
              if (err) {
                res.json({
                  success: false,
                });
              } else if (doc) {
                res.json({
                  success: true,
                  file: `public/uploads/temp/${req.user._id}.jpg`,
                });
              }
            }
          );
        }
      });
    } else res.json({ success: false });
  },
};
