var express = require("express");
var router = express.Router();
var Photo = require("../models/photo");
var middleware = require("../middleware");


// INDEX ROUTE
router.get("/", function(req, res){
    Photo.find({}, function(err, allPhotos){
        if(err){
            console.log(err);
        } else {
            res.render("gallery/index", {
                photos : allPhotos
            });
        }
    });
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name,
        image = req.body.image,
        desc = req.body.description,
        author = {
            id: req.user._id,
            username: req.user.username
        },
        newPhoto = {name: name, image: image, description: desc, author: author}
    
    Photo.create(newPhoto, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/gallery");
        }
    });
});

// NEW 
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("gallery/new");
});

// SHOW
router.get("/:id", function(req, res){
    Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhoto){
        if(err){
            console.log(err);
        } else {
            console.log(foundPhoto);
            res.render("gallery/show", {photo: foundPhoto});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkPhotoOwnership, function(req, res){
    Photo.findById(req.params.id, function(err, foundPhoto){
        res.render("gallery/edit", {photo: foundPhoto});
    });
});

//UPDATE
router.put("/:id", middleware.checkPhotoOwnership, function(req, res){
    Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatedPhoto){
        if(err){
            res.redirect("/gallery");
        } else {
            res.redirect("/gallery/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", middleware.checkPhotoOwnership, function(req, res){
    Photo.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/gallery");
        } else {
            res.redirect("/gallery");
        }
    });
});

module.exports = router;