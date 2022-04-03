const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blogWebsite", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log(`Connected to Database "BlogsComments"`);
});

const newComment = new mongoose.Schema({
    blog_id:{
        type: String,
        required: true
    },
    user_id: {
      type: String,
      required: true
    },
    user_name: {
      type: String,
      required: true
    },
    comment : {
        type: String,
    },
    post_date: {
        type: Date,
        required: true
    }
  });

const comment = mongoose.model("comment", newComment);
module.exports = comment;