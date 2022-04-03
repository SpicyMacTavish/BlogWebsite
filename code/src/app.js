//For Server Setup
const express = require("express");
const app = express();

//For template engine
const ejs = require("ejs");

//For defining the static file path
const path = require("path");

const bodyParser = require("body-parser");

//For Database connection
const mongoose = require("mongoose");

//For creating hashed password
const bcrypt = require("bcryptjs");

//For file uploading
const multer = require("multer");

const userAccount = require("./userDatabase");

const blog = require("./blogDatabase");
const { findOne } = require("./userDatabase");

const comment = require("./blogCommentsDatabase");

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view-engine", "ejs");

const staticPath = path.join(__dirname, "../");
console.log(staticPath);
app.use(express.static(staticPath));

const blogsfileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/blogs");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const blogsFileUpload = multer({
  storage: blogsfileStorage,
});

const server = require("http").createServer(app);

const port = process.env.PORT || 5050;

server.listen(port, function () {
  console.log(`Server is running at ${port}`);
});

app.get("/", async function (req, res) {
  try {
    var blogs = await blog.find().sort({
      post_date: "desc",
    });
    res.render("home.ejs", {
      blogs: blogs,
    });
  } catch (error) {
    res.status(404).send("Something Went Wrong!!");
  }
});

app.get("/signup", function (req, res) {
  res.render("signup.ejs");
});

app.post("/signup", async function (req, res) {
  try {
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;

    if (password === confirm_password) {
      var new_User = new userAccount({
        email_id: req.body.email_id,
        full_name: req.body.full_name,
        address: req.body.address,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
      });

      await new_User
        .save()
        .then(function () {
          res.redirect("/login");
        })
        .catch(function () {
          res.status(404).send("Problem!!");
        });
    } else {
      res.send("Passwords are not matching!!");
    }
  } catch (error) {
    res.status(404).send("Something went wrong");
  }
});

app.get("/login", function (req, res) {
  res.render("login.ejs", {
    error: true,
  });
});

app.get("/login", function (req, res) {
  res.render("login.ejs", {
    error: true,
  });
});

app.post("/login", async function (req, res) {
  try {
    const user = await userAccount.findOne({ email_id: req.body.email_id });
    const userPassword = req.body.password;

    var password_match = await bcrypt.compare(userPassword, user.password);

    if (password_match === true) {
      res.redirect("/" + user._id);
    } else {
      res.render("login.ejs", {
        error: password_match,
      });
    }
  } catch (error) {
    res.status(404).send("Something Went Worng!!");
  }
});

app.get("/:user_id", async function (req, res) {
  try {
    var user = await userAccount.findOne({ _id: req.params.user_id });
    var blogs = await blog.find().sort({
      post_date: "desc",
    });
    var noOfBusinessBlogs = await blog
      .find({ tag: "Business" })
      .countDocuments();
    var noOfFamilyBlogs = await blog.find({ tag: "Family" }).countDocuments();
    var noOEntertainmentBlogs = await blog
      .find({ tag: "Entertainment" })
      .countDocuments();
    var noOfHealthtBlogs = await blog.find({ tag: "Health" }).countDocuments();
    var noOfPoliticsBlogs = await blog
      .find({ tag: "Politics" })
      .countDocuments();
    var noOfReligionBlogs = await blog
      .find({ tag: "Religion" })
      .countDocuments();
    var noOfScienceBlogs = await blog.find({ tag: "Science" }).countDocuments();
    var noOfSportsBlogs = await blog.find({ tag: "Sports" }).countDocuments();
    var noOfTechnologyBlogs = await blog
      .find({ tag: "Technology" })
      .countDocuments();
    var noOfTravelBlogs = await blog.find({ tag: "Travel" }).countDocuments();
    var noOfVideoBlogs = await blog.find({ tag: "Video" }).countDocuments();
    var noOfWorldBlogs = await blog.find({ tag: "World" }).countDocuments();
    var noOfCarBlogs = await blog.find({ tag: "Car" }).countDocuments();
    res.render("authenticatedUserHome.ejs", {
      user_id: req.params.user_id,
      full_name: user.full_name,
      blogs: blogs,
      noOfBusinessBlogs: noOfBusinessBlogs,
      noOfFamilyBlogs: noOfFamilyBlogs,
      noOEntertainmentBlogs: noOEntertainmentBlogs,
      noOfHealthBlogs: noOfHealthtBlogs,
      noOfPoliticsBlogs: noOfPoliticsBlogs,
      noOfReligionBlogs: noOfReligionBlogs,
      noOfScienceBlogs: noOfScienceBlogs,
      noOfSportsBlogs: noOfSportsBlogs,
      noOfTechnologyBlogs: noOfTechnologyBlogs,
      noOfTravelBlogs: noOfTravelBlogs,
      noOfVideoBlogs: noOfVideoBlogs,
      noOfWorldBlogs: noOfWorldBlogs,
      noOfCarBlogs: noOfCarBlogs,
    });
  } catch (error) {
    res.status(404).send("Something Went Wrong!!");
  }
});

app.get("/:user_id/createBlog", function (req, res) {
  res.render("createBlog.ejs", {
    user_id: req.params.user_id,
  });
});

app.post(
  "/:user_id/createBlog",
  blogsFileUpload.single("uploaded_image"),
  async function (req, res) {
    try {
      var user = await userAccount.findOne({ _id: req.params.user_id });
      var newBlog = new blog({
        user_id: req.params.user_id,
        user_name: user.full_name,
        blog_title: req.body.blog_title,
        blog_description: req.body.blog_description,
        uploaded_image: req.file.filename,
        tag: req.body.tag,
        post_date: Date.now(),
      });
      await newBlog
        .save()
        .then(function () {
          res.redirect("/" + req.params.user_id);
        })
        .catch(function () {
          res.send("Problem!!");
        });
    } catch (error) {
      res.status(404).send("Something Went Wrong!!");
    }
  }
);

app.get("/:user_id/:blog_id", async function (req, res) {
  try {
    var individualBlog = await blog.findOne({ _id: req.params.blog_id });
    var comments = await comment.find({ blog_id: req.params.blog_id }).sort({
      post_date: "desc",
    });
    res.render("individualBlog.ejs", {
      user_id: req.params.user_id,
      individualblog: individualBlog,
      comments: comments,
    });
  } catch (error) {
    res.status(404).send("Something Went Wrong!!");
  }
});

app.post("/:user_id/:blog_id", async function (req, res) {
  try {
    var user = await userAccount.findOne({ _id: req.params.user_id });
    var individualBlog = await blog.findOne({ _id: req.params.blog_id });
    var newComment = new comment({
      blog_id: req.params.blog_id,
      user_id: req.params.user_id,
      user_name: user.full_name,
      comment: req.body.blog_comment,
      post_date: Date.now(),
    })
      .save()
      .then(function () {
        res.redirect("/" + req.params.user_id + "/" + req.params.blog_id);
      })
      .catch(function () {
        res.send("Problem!!");
      });
  } catch (error) {
    res.status(404).send("Something Went Wrong!!");
  }
});

app.get("/newSoftware", function (req, res) {
  res.send("hello!!");
});
