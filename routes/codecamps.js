var express     = require("express"),
    router      = express.Router(),
    Codecamp    = require("../models/codecamp"),
    middleware  = require("../middleware");

// =================
// CODECAMP ROUTES
// =================

//displays all codecamps
router.get("/", function(req, res){
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all codecamps from DB
        Codecamp.find({name: regex}, (err, searchResults) => {
            if (err) {
                console.log(err);
            } else {
                if (searchResults.length === 0) {
                    req.flash('error', 'Sorry, no codecamps match your query. Please try again');
                    return res.redirect('/codecamps');
                }
                res.render('codecamps/index', {codecamps: searchResults,
                                                 page: 'codecamps' });
            }
        });
    } else {
        // Get all codecamps from DB
        Codecamp.find({}, function(err, allCodecamps){
           if(err){
               console.log(err);
           } else {
              res.render("codecamps/index",{codecamps:allCodecamps});
           }
        });
    }
});
    
// New Codecamp route
router.post("/", middleware.isLoggedIn,function(req,res){
    // get data from form and add to codecamp array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCodecamp = {name: name, image: image, description:desc, author: author}
    // Create a new codecamp and save to database
    Codecamp.create(newCodecamp, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            req.flash("success", "New Codecamp created successfully");
            // redirect back to codecamps page
            res.redirect("/codecamps");     
        }
    });
});

// New Codecamp form route
router.get("/new", middleware.isLoggedIn,function(req, res) {
    res.render("codecamps/new"); 
});


// Shows more info about one codecamp
router.get("/:id", function(req, res) {
    //find the codecamp with ID 
    Codecamp.findById(req.params.id).populate("comments").exec(function(err, foundCodecamp){
       if(err) {
            console.log(err);
       } else {
            //render show template with that template
            res.render("codecamps/show", {codecamp: foundCodecamp});         
       }
    });
});

// Edit Codecamp Route
    //Renders the form for Editing Codecamp
router.get("/:id/edit", middleware.checkCodecampOwnership,function(req, res) {
    Codecamp.findById(req.params.id, function(err, foundCodecamp){
        if(err) {
            req.flash("error", "Codecamp not found");
            res.redirect("/codecamps");
        } else {
            res.render("codecamps/edit", {codecamp: foundCodecamp});    
        }
    });
});

// Update Codecamp Route
router.put("/:id", middleware.checkCodecampOwnership, function(req, res){
    //Find and Update the correct codecamp
    Codecamp.findByIdAndUpdate(req.params.id, req.body.codecamp, function(err, updatedCodecamp){
        if(err) {
            req.flash("error", "Codecamp not found");
            res.redirect("/codecamps");
        } else {
            req.flash("success", "Codecamp Updated");
            res.redirect("/codecamps/" + req.params.id);
        }
    });
    //Redirect to Show Page
});

//Delete Codecamp Route
router.delete("/:id",middleware.checkCodecampOwnership, function(req, res){
    Codecamp.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            req.flash("error", "Codecamp not found");
            res.redirect("/codecamps");   
        } else {
            req.flash("success", "Codecamp deleted successfully");
            res.redirect("/codecamps");
        }
    }); 
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;