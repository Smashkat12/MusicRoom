const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new mongoose.Schema({
    name: { type: String},
    description: { type: String},
    type:  { type: String},
    users: { type: Array},
    songs: { type: Array},
    location: { type: Object },
    created_at: Date
})

//Set current date during insert
RoomSchema.pre("save", function (next) {
    const currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) this.created_at = currentDate;
    next();
});

//Set Collection
const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;