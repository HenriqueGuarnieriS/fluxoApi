const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
require("dotenv").config();

const app = express();
app.use(express.json());

// Rota principal para autorizações de callback do Instagram
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res
      .status(400)
      .json({ error: "Código de autorização não fornecido" });
  }

  try {
    // Trocar o código de autorização por um token de acesso
    const response = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      querystring.stringify({
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;
    const userId = response.data.user_id;

    // Salvando o token e o usuário em algum armazenamento ou base de dados
    console.log(`Token de acesso: ${accessToken}, ID do usuário: ${userId}`);

    res.json({ message: "Autenticação bem-sucedida", data: response.data });
  } catch (error) {
    console.error(
      "Erro ao trocar código por token:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Erro durante o processo de autenticação" });
  }
});

// Rota de desautorização
app.post("/auth/deauthorize", (req, res) => {
  const { user_id } = req.body;

  // Realizar a lógica para desativar a conta ou remover o usuário da base de dados
  console.log(`Usuário desautorizado: ${user_id}`);
  res.sendStatus(200);
});

// Rota de exclusão de dados
app.post("/auth/delete-data", (req, res) => {
  const { user_id } = req.body;

  // Realizar a lógica para deletar os dados do usuário
  console.log(`Solicitação de exclusão de dados para o usuário: ${user_id}`);
  res.sendStatus(200);
});

// Rota para verificar o status
app.get("/", (req, res) => {
  res.send("API do Instagram está funcionando");
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
