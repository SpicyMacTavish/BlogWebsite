const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb://localhost:27017/blogWebsite", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log(`Connected to Database "UserData"`);
});

const newUser = new mongoose.Schema({
  email_id: {
    type: String,
    required: true
  },
  full_name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    maxLength: 20
  },
  confirm_password: {
    type: String,
    required: true
  }
});

newUser.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  this.confirm_password = undefined;
  next();
});

const userAccount = mongoose.model("userAccount", newUser);
module.exports = userAccount;
