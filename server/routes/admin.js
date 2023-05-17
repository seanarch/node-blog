const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// Routes
// POST / admin - register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "User created", user });
    } catch (err) {
      if (err.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
