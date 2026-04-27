const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.get("/test", (req, res) => {
  res.json({ message: "API working ✅" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});