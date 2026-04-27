const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.get("/test", (req, res) => {
  res.json({ message: "API working ✅" });
});

// ✅ ABDM Token Function
async function getAbdmToken() {

  // ✅ MOCK MODE
  if (process.env.USE_MOCK === "true") {
    return "mock-token-123";
  }

  // ✅ REAL MODE
  try {
    const response = await axios.post(
      "https://dev.abdm.gov.in/gateway/v0.5/sessions",
      {
        clientId: process.env.ABDM_CLIENT_ID,
        clientSecret: process.env.ABDM_CLIENT_SECRET,
      }
    );

    return response.data.accessToken;

  } catch (error) {
    console.error("Token error:", error.response?.data || error.message);
    throw error;
  }
}

// ✅ ADD THIS ROUTE (missing piece)
app.get("/abdm/token", async (req, res) => {
  try {
    const token = await getAbdmToken();
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Failed to get token" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});