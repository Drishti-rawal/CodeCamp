// =================
// App Setup
// =================
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    flash           = require("connect-flash"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Codecamp        = require("./models/codecamp"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
// requiring routes    
var commentRoutes   = require("./routes/comments"),
    codecampRoutes  = require("./routes/codecamps"),
    indexRoutes     = require("./routes/index"),
    userRoute       = require("./routes/user");
    
    
app.use(bodyParser.urlencoded({extended: true}));    
app.set("view engine", "ejs");  
mongoose.connect("mongodb://localhost:27017/code_camp", {useNewUrlParser: true});
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();
app.locals.moment = require("moment");

// =================    
// PASSPORT CONFIGURATION    
// =================
app.use(require("express-session")({
    secret: "Codecamp secret key",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Passing Current User to all routes
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Making Router work
app.use("/", indexRoutes);
app.use("/codecamps", codecampRoutes);
app.use("/codecamps/:id/comments", commentRoutes);
app.use("/users", userRoute);

// =================    
// CodeCamp Server Initialization
// =================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("CodeCamp Server Has Started!");
}); 