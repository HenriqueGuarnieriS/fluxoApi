const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
// Configurar CORS para permitir a origem específica
const corsOptions = {
  origin: [
    // "http://localhost:5173",
    // "http://192.168.22.201:5173",
    "appsocial.up.railway.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Rota principal para autorizações de callback do Instagram

// Rota para verificar o status
app.get("/", (req, res) => {
  res.send("API do Instagram está funcionando");
});
// Rota para verificar o status
app.get("/socialblade/:username", async (req, res) => {
  const { username } = req.params;
  const SocialBlade = require("socialblade");

  const client = new SocialBlade(
    process.env.SOCIALBLADE_CLIENT_ID,
    process.env.SOCIALBLADE_ACCESS_TOKEN
  );

  // Get a YouTube User
  const response = await client.instagram.user(username);
  console.log("request made");
  res.send(response);
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta 3000 e acessível de qualquer rede");
});
