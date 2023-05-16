const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

const adminLayout = "../views/layouts/admin";

// Routes
// GET / HOME
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple blog created with NodeJS and mongoDB",
    };
    let slug = req.params.id;

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (err) {
    console.error(err);
  }
});

// Routes
// POST / admin -check login
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (req.body.username === "admin" && req.body.password === "password") {
      res.send("You are logged in.");
      res.redirect("/admin");
    } else {
      res.send("Wrong username or password");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
