const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

// check login
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

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
// router.post("/admin", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (req.body.username === "admin" && req.body.password === "password") {
//       res.send("You are logged in.");
//       res.redirect("/admin");
//     } else {
//       res.send("Wrong username or password");
//     }
//   } catch (err) {
//     console.error(err);
//   }
// });

// Routes
// POST / admin - check login
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
  }
});

// Routes
// POST / admin - register
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog created with NodeJs, Express and MongoDb",
    };

    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (err) {
    console.error(err);
  }
});

// router.post("/admin", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (req.body.username === "admin" && req.body.password === "password") {
//       res.send("You are logged in.");
//       res.redirect("/admin");
//     } else {
//       res.send("Wrong username or password");
//     }
//   } catch (err) {
//     console.error(err);
//   }
// });

// Routes
// GET / admin - create new post
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - Create New Post
 */
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });

      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
