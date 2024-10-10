const express = require("express");
const axios = require("axios");
const cors = require("cors");
const jwt = require("jsonwebtoken"); // Para gerar e validar JWT
const cookieParser = require("cookie-parser"); // Para lidar com cookies
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser()); // Ativa o uso de cookies

// Configurar CORS para permitir a origem do frontend
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL // A URL do frontend em produção
      : ["http://localhost:5173"], // Permitir localhost em desenvolvimento
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Permitir envio de cookies
};

app.use(cors(corsOptions));

// Middleware para verificar o token JWT em produção
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.path === "/generate-token") return next(); // Permite o acesso a essa rota sem autenticação

    const token = req.cookies.authToken; // O token é extraído do cookie

    if (!token) return res.status(401).send("Access Denied");

    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY);
      req.user = verified; // Adiciona o usuário verificado à requisição
      next();
    } catch (err) {
      res.status(400).send("Invalid Token");
    }
  });
}

// Middleware para verificar o User-Agent e o Referer
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    const userAgent = req.headers["user-agent"];
    const referer = req.headers["referer"];

    if (
      !userAgent.includes("Mozilla") || // Certifica-se de que a requisição veio de um navegador
      !referer.includes(process.env.FRONTEND_URL)
    ) {
      return res.status(403).send("Requisição Bloqueada");
    }
    next();
  });
}
// Rota para verificar o status
app.get("/", (req, res) => {
  res.send("API do Instagram está funcionando");
});

// Gerar token JWT
app.get("/generate-token", (req, res) => {
  const token = jwt.sign({ user: "frontendUser" }, process.env.SECRET_KEY, {
    expiresIn: "15m",
  });

  res.cookie("authToken", token, {
    httpOnly: true, // Cookie não acessível via JavaScript
    secure: process.env.NODE_ENV === "production", // Só envia via HTTPS em produção
  });
  res.json({ message: "Token gerado" });
});

// Rota para pegar dados do SocialBlade
app.get("/tracking/:username", async (req, res) => {
  const { username } = req.params;
  const SocialBlade = require("socialblade");

  const client = new SocialBlade(
    process.env.SOCIALBLADE_CLIENT_ID,
    process.env.SOCIALBLADE_ACCESS_TOKEN
  );

  // Pega informações do usuário no Instagram através do SocialBlade
  const response = await client.instagram.user(username);
  console.log("request made");
  res.send(response);
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
