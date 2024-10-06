const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Instagram OAuth Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const CLIENT_ID = "seu_client_id";
const CLIENT_SECRET = "seu_client_secret";
const REDIRECT_URI = "http://localhost:3000/auth/callback";

app.get("/auth", (req, res) => {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authUrl);
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
        code: code,
      }
    );

    const accessToken = response.data.access_token;
    const userId = response.data.user_id;

    // Você pode salvar o token de acesso em um banco de dados para futuras requisições
    res.send(`Access Token: ${accessToken} | User ID: ${userId}`);
  } catch (error) {
    console.error("Error exchanging code for token", error.response.data);
    res.status(500).send("An error occurred while exchanging code for token.");
  }
});
