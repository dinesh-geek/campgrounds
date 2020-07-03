var express = require("express"),
 app = express(),
 bodyparser = require("body-parser"),
 mongoose = require("mongoose"),
 flash = require("connect-flash"),
 passport = require("passport"),
 LocalStrategy = require("passport-local"),
 methodOverride = require("method-override"),
 Campground = require("./models/campground"),
 Comment = require("./models/comment"),
 User = require("./models/user"),
 seedDB = require("./seed");


//requring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    passwordRoutes   = require("./routes/password");

mongoose.connect("mongodb://localhost:27017/code", {
    useNewUrlParser: true
});
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(flash());
// seedDB();//seed the datbase
 
//passport configuration
app.use(require("express-session")({
    secret:"once again rusty wins cutest dog",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success= req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",passwordRoutes);



app.listen(3000,function(){
    console.log(" yelpcamp server has started");
});