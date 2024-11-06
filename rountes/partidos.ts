import express from "express";
import { Request, Response } from "express";
import { getPartidos } from "../services/eleicao";

const router = express.Router(); // Cria o roteador express
router.get("/partidos", async (req: Request, res: Response): Promise<any> => {
  try {
    // Faz a requisição para o endpoint externo para cada username
    const response = await getPartidos();

    // Retorna os dados tipados como InstagramData[]
    return res.send(response);
  } catch (error) {
    // Verifica se o erro é uma instância de Error
    if (error instanceof Error) {
      return res.status(500).json({
        error: "Erro ao processar o perfil",
        details: error.message,
      });
    } else {
      return res
        .status(500)
        .json({ error: "Erro desconhecido ao processar o perfil" });
    }
  }
});
export default router; // Exporta o roteador
