const express = require('express');
const urlRoute = require('./routers/url');
const { connectToMongoDB } = require('./connnect');
const URL = require('./models/url');

const app = express();
const port = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
  .then(() => console.log("MongoDB connected"));

app.use(express.json());
app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
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
