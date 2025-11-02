const {v4:uuidv4} = require('uuid');
const User = require('../models/user');
const { setUser } = require('../service/auth');

async function handleUserSignup(req,res){
    const {name,email,password} = req.body;
    await User.create({
        name,
        email,
        password
    });
    return res.redirect("/");
}

async function handleUserLogin(req, res) {
  try {
    console.log("Login route hit!");
    const { email, password } = req.body;
    console.log(" Received:", email, password);

    let user = await User.findOne({ email });
    console.log("DB lookup result:", user);

    if (!user) {
      console.log("Creating new user...");
      user = await User.create({
        name: (email || "unknown").split("@")[0],
        email,
        password,
      });
      console.log(" New user created:", user.email);
    } else if (user.password !== password) {
      console.log("Invalid password for:", email);
      return res.render("login", { error: "Invalid password" });
    }

    const token = setUser({ _id: user._id, email: user.email });
    console.log("Token generated:", token.slice(0, 20) + "...");

    res.cookie("uid", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("Cookie sent successfully for:", email);
    res.redirect("/");
  } catch (err) {
    console.error("Error in handleUserLogin:", err);
    res.status(500).send("Internal Server Error");
  }
}




module.exports = {handleUserSignup,handleUserLogin,};