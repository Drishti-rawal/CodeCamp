var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");

// =================    
// PATHS    
// =================

// Root Route- Landing Page
router.get("/", function(req, res){
    res.render("landing"); 
});

    
// =================  
// AUTH ROUTES
// ================= 

// Show Register Form
router.get("/register", function(req, res) {
    res.render("register"); 
});

//Handle Sign Up Logic
router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    if(req.body.adminCode === 'testAdminCode') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            return res.render("register", {"error": err.message});
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to CodeCamp " + user.username);
            res.redirect("/codecamps"); 
        });
    }); 
});

// show login form
router.get("/login", function(req, res){
    res.render("login");
});

// Handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/codecamps",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to CodeCamp!'
    }), function(req, res){
});

// Logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success","You have successfully logged out!");
    res.redirect("/codecamps");
});




module.exports = router;