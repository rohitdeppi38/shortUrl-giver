const express = require('express');
const router = express.Router();

// ✅ Import your URL model
const URL = require('../models/url');

router.get('/', async (req, res) => {
  try {
    const allUrls = await URL.find({});
    return res.render("home", { urls: allUrls });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
