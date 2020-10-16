const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String },
  lastname: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
  cover: { type: String },
  email: { type: String, unique: true },
  confirmKey: { type: String },
  forgotKey: { type: String },
  admin: { type: Boolean, default: false },
  created_at: Date,
  updated_at: Date,
});

UserSchema.pre("save", function (next) {
  const currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) this.created_at = currentDate;
  next();
});

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.isMailConfirmed = function () {
  return this.confirmKey === "confirmed";
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
