//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });


// Create a schema for the users
const userSchema = {
  email: String,
  password: String
}

//user model
const User = mongoose.model("User", userSchema);


const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Blog post title can't be empty."]
  },
  content: {
    type: String,
    required: [true, "Blog post body can't be empty."]
  }
});

const Post = mongoose.model("Post", postSchema);//created model

app.get("/", function (req, res) {

  Post.find({}, function (err, posts) {
    res.render("home", {
      posts: posts
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle.toUpperCase(),
    content: req.body.postBody
  });


  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
      id: requestedPostId
    });
  });

});
app.post("/delete", (req, res) => {

  const requestedId = req.body.deleteButton;

  Post.findByIdAndDelete({ _id: requestedId }, (err) => {
    if (!err) {
      res.redirect("/");
    } else {
      console.log(err);
    }
  });
});




app.listen(3000, function () {
  console.log("Server started on port 3000");
});
