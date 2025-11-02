const { getUser } = require('../service/auth');

function restrictToLoggedinUserOnly(req, res, next) {
  const token = req.cookies?.uid;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const user = getUser(token);
    if (!user) {
      return res.redirect("/login");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error verifying token:", err.message);
    return res.redirect("/login");
  }
}

function checkAuth(req, res, next) {
  const token = req.cookies?.uid;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const user = getUser(token);
    req.user = user || null;
    next();
  } catch (err) {
    console.error("Error verifying token:", err.message);
    req.user = null;
    next();
  }
}

module.exports = {
  restrictToLoggedinUserOnly,
  checkAuth
};
