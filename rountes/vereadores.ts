import express from "express";
import { Request, Response } from "express";
import {
  cacheAllAggregations,
  getAggregationData,
} from "../database/vereadores";

const router = express.Router(); // Cria o roteador express

router.get(
  "/vereadores/aggregate",
  async (req: Request, res: Response): Promise<any> => {
    try {
      // Faz a requisição para o endpoint externo para cada username
      const response = await cacheAllAggregations();

      // Retorna os dados tipados como InstagramData[]
      return res.send(response);
    } catch (error) {
      // Verifica se o erro é uma instância de Error
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Erro ao processar o vereadores",
          details: error.message,
        });
      } else {
        return res.status(500).json({
          error: "Erro desconhecido ao criar aggregations",
        });
      }
    }
  }
);
router.get(
  "/vereadores/data",
  async (req: Request, res: Response): Promise<any> => {
    try {
      // Faz a requisição para o endpoint externo para cada username
      const response = await getAggregationData();

      // Retorna os dados tipados como InstagramData[]
      return res.send(response);
    } catch (error) {
      // Verifica se o erro é uma instância de Error
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Erro ao processar o vereadores",
          details: error.message,
        });
      } else {
        return res.status(500).json({
          error: "Erro desconhecido ao criar aggregations",
        });
      }
    }
  }
);

export default router; // Exporta o roteador
