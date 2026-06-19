const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   BASIC ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.get("/test", (req, res) => {
  res.json({
    message: "API working ✅",
  });
});

/* =========================
   ABDM TOKEN FUNCTION
========================= */

async function getAbdmToken() {
  console.log("USE_MOCK =", process.env.USE_MOCK);

  // MOCK MODE
  if (process.env.USE_MOCK === "true") {
    console.log("Using MOCK token");
    return "mock-token-123";
  }

  try {
    console.log(
      "CLIENT ID EXISTS:",
      !!process.env.ABDM_CLIENT_ID
    );

    console.log(
      "CLIENT SECRET EXISTS:",
      !!process.env.ABDM_CLIENT_SECRET
    );

    const response = await axios.post(
      "https://dev.abdm.gov.in/gateway/v0.5/sessions",
      {
        clientId: process.env.ABDM_CLIENT_ID,
        clientSecret: process.env.ABDM_CLIENT_SECRET,
        grantType: "client_credentials",
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("ABDM token generated successfully");

    return (
      response.data.accessToken ||
      response.data.access_token ||
      response.data.token
    );
  } catch (error) {
    console.error(
      "Token error:",
      error.response?.status,
      error.response?.data || error.message
    );

    throw error;
  }
}

/* =========================
   GET ABDM TOKEN
========================= */

app.get("/abdm/token", async (req, res) => {
  try {
    const token = await getAbdmToken();

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to get token",
    });
  }
});

/* =========================
   CALLBACK ENDPOINTS
========================= */

app.get("/abdm/callback", (req, res) => {
  res.send("ABDM callback endpoint is live ✅");
});

app.post("/abdm/callback", (req, res) => {
  console.log("ABDM Callback Received");
  console.log(JSON.stringify(req.body, null, 2));

  res.status(200).json({
    status: "ACKNOWLEDGED",
  });
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});