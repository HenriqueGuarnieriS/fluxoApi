const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const SocialBlade = require("socialblade");
import { NextFunction, Request, Response } from "express"; // Mantendo os types

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Configurar CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware global
app.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

// Middleware para verificar o token JWT em produção
if (process.env.NODE_ENV === "production") {
  app.use((req: Request, res: Response, next: NextFunction): void => {
    if (req.path === "/generate-token") return next();

    const token = req.cookies.authToken;
    if (!token) {
      res.status(401).send("Access Denied");
      return;
    }

    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY as string);
      (req as any).user = verified;
      next();
    } catch (err) {
      res.status(400).send("Invalid Token");
    }
  });

  app.use((req: Request, res: Response, next: NextFunction): void => {
    const userAgent = req.headers["user-agent"] || "";
    const referer = req.headers["referer"] || "";

    if (
      !userAgent.includes("Mozilla") ||
      !referer.includes(process.env.FRONTEND_URL as string)
    ) {
      res.status(403).send("Requisição Bloqueada");
      return;
    }
    next();
  });
}

// Rota para verificar o status
app.get("/", (req: Request, res: Response) => {
  res.send("API do Instagram está funcionando");
});

// Gerar token JWT
app.get("/generate-token", (req: Request, res: Response) => {
  const token = jwt.sign(
    { user: "frontendUser" },
    process.env.SECRET_KEY as string,
    {
      expiresIn: "15m",
    }
  );

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Token gerado" });
});

// Rota para pegar dados do SocialBlade
app.get("/tracking/:username", async (req: Request, res: Response) => {
  const { username } = req.params;
  console.log(`Request to @${username}`);

  const client = new SocialBlade(
    process.env.SOCIALBLADE_CLIENT_ID as string,
    process.env.SOCIALBLADE_ACCESS_TOKEN as string
  );

  const response = await client.instagram.user(username);
  res.send(response);
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1); // Encerrar o processo com falha
  }
};

// Chamando a função para conectar ao banco de dados
connectDB();
