const express = require('express');
const { connectToMongoDB } = require('./connnect');
const URL = require('./models/url');
const {restrictToLoggedinUserOnly,checkAuth} = require('./middleware/auth');

const StaticRoute = require('./routers/staticRouter');
const urlRoute = require('./routers/url');
const userRoute = require('./routers/user');
const cookieParser = require('cookie-parser');

const path = require("path")

const app = express();
const port = 8000;

connectToMongoDB('mongodb://localhost:27017/short-url')
  .then(() => console.log("MongoDB connected"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


app.set('view engine',"ejs");
app.set("views",path.resolve("./views"));


app.use('/user',userRoute);
app.use("/url", restrictToLoggedinUserOnly , urlRoute);
app.use("/", (req, res, next) => {
  if (req.path === '/login' || req.path === '/signup') {
    return next(); // skip auth check for login/signup pages
  }
  checkAuth(req, res, next);
}, StaticRoute);




app.get('/url/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  console.log(shortId);

  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );

  if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  res.redirect(entry.redirectURL);
});

app.get('/analytics/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOne({ shortId });

  if (!entry) {
    return res.status(404).json({ error: "URL not found" });
  }

  res.json({
    totalClicks: entry.visitHistory.length,
    analytics: entry.visitHistory,
  });
  console.log(entry.visitHistory.length);
});

app.listen(port, () => {
  console.log(`Server started at the port ${port}`);
});
