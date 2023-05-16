const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

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

module.exports = router;
