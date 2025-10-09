const User = require('../models/user');

async function handleUserSignup(req,res){
    const {name,email,password} = req.body;
    await User.create({
        name,
        email,
        password
    });
    return res.render("home");
}

async function handleUserSignup(req,res){
    const {name,email,password} = req.body;
    await User.create({
        name,
        email,
        password
    });
    return res.redirect("/");
}
async function handleUserLogin(req,res){
    const {name,email,password} = req.body;
    await User.findOne({email,password});
    if(!user) return res.render("login",{
        error:"Invalid Username or Password"
    })
    return res.redirect("/");
}


module.exports = {handleUserSignup,handleUserLogin,};