var mongoose = require("mongoose");

var photoSchema = new mongoose.Schema({
    name: String,
    image: String, 
    description: String,
    createAt:{
        type: Date, 
        default: Date.now
    },
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Photo", photoSchema);