var Codecamp = require("../models/codecamp");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCodecampOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Codecamp.findById(req.params.id, function(err, foundCodecamp){
           if(err){
               req.flash("error", "Codecamp not found");
               res.redirect("back");
           }  else {
               // does user own the codecamp?
            if(foundCodecamp.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               req.flash("error", "Something went wrong");
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;