var express = require("express"),
    router = express.Router({mergeParams: true});
    Photo = require("../models/photo");
    Comment = require("../models/comment");
    middleware = require("../middleware");

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    Photo.findById(req.params.id, function(err, foundPhoto){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {photo: foundPhoto});
        }
    });
});

// Create
router.post("/", middleware.isLoggedIn, function(req, res){
    Photo.findById(req.params.id, function(err, photo){
        if(err){
            console.log(err);
            res.redirect("/gallery");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    photo.comments.push(comment);
                    photo.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/gallery/" + photo._id);
                }
            });
        }
    });
});

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {photo_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/gallery/" + req.params.id);
        }
    });
});

// DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/gallery/" + req.params.id);
        }
    });
});

module.exports = router;