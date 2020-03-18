var express      = require("express"),
      router     = express.Router(),
      User       = require("../models/user"),
      Codecamp   = require("../models/codecamp"),
      middleware = require("../middleware");

//Users Profiles
router.get("/:id",middleware.isLoggedIn ,function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if(err || !foundUser) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
    Codecamp.find().where('author.id').equals(foundUser._id).exec(function(err, codecamps) {
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }
      res.render("users/show", {user: foundUser, codecamps: codecamps});
    })
  });
});

//Edit form Route
router.get("/:id/edit", middleware.isLoggedIn, (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err || !foundUser) { return res.redirect("back"); }
    if (foundUser._id.equals(req.user._id) || req.user.isAdmin) {
      res.render("users/edit", { user: foundUser }); 
    } else {
      req.flash("error", "You don't have permission to do that");
      res.redirect("back");
    } 
  });
});

//Update user profile route
router.put("/:id", middleware.isLoggedIn, (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body.user, (err, updatedUser) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate email
        req.flash("error", "That email has already been registered.");
        return res.redirect("/users" + req.params.id);
      } 
      // Some other error
      req.flash("error", "Something went wrong...");
      return res.redirect("/users" + req.params.id);
    }
    if (updatedUser._id.equals(req.user._id) || req.user.isAdmin) {
        req.flash("success", "Profile Updated");
        res.redirect("/users/" + req.params.id);
    } else {
      req.flash("error", "You don't have permission to do that");
      res.redirect("/codecamps");
    }
  });
});

module.exports = router;