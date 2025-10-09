const express = require('express');
const router = express.Router();

// ✅ Import your URL model
const URL = require('../models/url');

router.get('/', async (req, res) => {
  try {
    if(!req.user) return res.redirect("/login");
    const allUrls = await URL.find({createdBy:req.user.id});
    return res.render("home", { urls: allUrls });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

router.get('/signup',(req,res)=>{
  return res.render("signup")
});

router.get('/login',(req,res)=>{
  return res.render("login");
})

module.exports = router;
