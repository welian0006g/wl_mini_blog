var express = require("express");

var User = require("./models/user");

var passport = require("passport");

var Blog = require("./models/blog");

var router = express.Router();

router.use(function(req,res,next) {
   res.locals.currentUser = req.user;
   res.locals.errors = req.flash("error");
   res.locals.infos = req.flash("info");
   next();
});

function ensureAuthenticated(req,res,next) {
  if (req.isAuthenticated()) {
      next();
  } else {
      req.flash("info","You must be logged in to see this page.");
      res.redirect("/login");
  } 
}

router.get("/", function(req,res) {

    Blog.find()
        .sort({ createdAt: "descending" })
        .exec(function(err,blogs) {
           if (err) {return next(err);}
           res.render("index", {blogs: blogs});
        });
});

router.get("/user/:id",ensureAuthenticated, function(req,res) {
    User.findById(req.params.id,function(err,user) {
       if(err) {return next(err);}

       res.render("user_detail",{user: user});
    });
});

router.get("/edit",ensureAuthenticated, function(req,res) {
  res.redirect("/user/"+req.user._id);
});

router.get("/signup",function(req,res) {
   res.render("signup");
});

router.get("/about",function(req,res) {
   res.render("about");
});

router.post("/signup",function(req,res,next) {
   var username = req.body.username;
   var password = req.body.password;

   User.findOne({username: username}, function(err,user) {
      if (err) { return next(err);}
      if (user) {
         req.flash("error","User already exists");
         return res.redirect("/signup");
      }

      var newUser = new User({
         username: username,
         password: password
      });
      newUser.save(next);
   });
}, passport.authenticate("login", {
   successRedirect: "/",
   failureRedirect: "/signup",
   failureFlash: true
}));

router.get("/new_blog",ensureAuthenticated,function(req,res) {
   res.render("new_blog");
});

router.post("/new_blog",ensureAuthenticated,function(req,res) {
   var title = req.body.title;
   var content = req.body.content;

   
   var newBlog = new Blog({
       title: title,
       content: content.replace(/\r\n/g,"<br/>").replace(/\"/g,"'"),
       user_id: req.user._id,
       user_name: req.user.name()
   });

   newBlog.save();

   res.redirect("/");
});

router.get("/blog/:id",ensureAuthenticated,function(req,res) {
   Blog.findById(req.params.id,function(err,blog) {
      if (err) { return next(err);}

      res.render("blog_detail",{blog: blog});
   });
});

router.delete("/blog/:id",ensureAuthenticated,function(req,res) {
   Blog.findByIdAndRemove(req.params.id,function(err) {
      if (err) {return next(err);}

      res.status(200).json({"status":"delete success"});
   });
});

router.get("/query",function(req,res) {
   res.send("Query parameter is->"+req.query.name);
});

router.get("/login",function(req,res) {
    res.render("login");
});

router.post("/login",passport.authenticate("login",{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logout",function(req,res) {
   req.logout();
   res.redirect("/");
});

module.exports = router;
