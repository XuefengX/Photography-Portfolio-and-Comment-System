var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    createAt: {
        type: Date,
        default: Date.now
    },
    author: {
        id: { // embed a document inside of another document
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);