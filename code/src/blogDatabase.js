const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blogWebsite", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log(`Connected to Database "Blogs"`);
});

const newBlog = new mongoose.Schema({
    user_id: {
      type: String,
      required: true
    },
    user_name: {
      type: String,
      required: true
    },
    blog_title: {
      type: String,
      required: true
    },
    blog_description: {
      type: String,
      required: true
    },
    uploaded_image: {
      type: String,
    },
    tag: {
      type: String,
    },
    post_date: {
        type: Date,
        required: true
    }
  });

const blog = mongoose.model("blog", newBlog);
module.exports = blog;
  
