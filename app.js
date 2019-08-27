var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override"),
    Photo = require("./models/photo"),
    Comment = require("./models/comment"),
    User = require("./models/user")

//requiring routes
var commentRoutes    = require("./routes/comments"),
    galleryRoutes = require("./routes/photos"),
    indexRoutes      = require("./routes/index")

const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/Read_Photos';

mongoose.connect(databaseUri);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

// Passport configuration
app.use(require("express-session")({
    secret: "Juan is the cutest girl",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.use("/", indexRoutes);
app.use("/gallery", galleryRoutes);
app.use("/gallery/:id/comments", commentRoutes);

var port = process.env.PORT || 3000
app.listen(port, function(){
    console.log("The Server Has Started!");
})