const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    name: { type: String },
    description: { type: String },
    type: { type: String },
    /*users: { type: Array },*/
    tracks: { type: Array },
    created_at: Date
});

//Set current date during insert
PlaylistSchema.pre("save", function (next) {
    const currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) this.created_at = currentDate;
    next();
});

//Set Collection
const Playlist = mongoose.model("Playlist", PlaylistSchema);

module.exports = Playlist;