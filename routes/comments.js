var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Codecamp    = require("../models/codecamp"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

// =================
// COMMENTS ROUTES
// =================

// NEW Comment form
router.get("/new", middleware.isLoggedIn ,function(req, res) {
    //find codecamp by id
    Codecamp.findById(req.params.id, function(err, codecamp){
       if(err) {
           req.flash("error", "Codecamp not found");
           console.log(err);
       } else {
                res.render("comments/new", {codecamp: codecamp});           
       }
    });
 
});

// CREATE Comment
router.post("/",middleware.isLoggedIn ,function(req, res){
   //lookup campground using ID
   Codecamp.findById(req.params.id, function(err, codecamp){
       if(err){
           console.log(err);
           req.flash("error", "Codecamp not found");
           res.redirect("/codecamps");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               // add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               // save comment   
               comment.save(); 
               codecamp.comments.push(comment);
               codecamp.save();
               req.flash("success", "Successfully Added Comment");
               res.redirect('/codecamps/' + codecamp._id);
           }
        });
       }
   });
});

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            res.render("comments/edit", {codecamp_id: req.params.id, comment: foundComment});
        }
    }); 
});

// UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            req.flash("success", "Comment Updated");
            res.redirect("/codecamps/" + req.params.id);
        }
    }); 
});

// DESTROY COMMENT ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted Successfully");
            res.redirect("/codecamps/" + req.params.id);
        }
    }); 
});


module.exports = router;