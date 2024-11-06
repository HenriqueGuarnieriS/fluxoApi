import express from "express";
import {
  getInstagram,
  getInstagrams,
  saveProfile,
  updateInstagrams,
} from "../database/mongo";
import { Request, Response } from "express";
import { SocialBladeService } from "../services/socialblade";
import { InstagramUser } from "socialblade";

const router = express.Router(); // Cria o roteador express
const socialBladeService = new SocialBladeService();
// Rota que recebe uma lista de usernames e salva os perfis
router.post(
  "/save-profiles",
  async (req: Request, res: Response): Promise<any> => {
    const { usernames } = req.body;

    if (!Array.isArray(usernames)) {
      return res.status(400).json({
        error: "O corpo da requisição deve ser uma lista de usernames.",
      });
    }

    // Loop para cada username na lista
    try {
      const users: InstagramUser[] = [];
      await Promise.all(
        usernames.map(async (user) => {
          if (!(await getInstagram(user))) {
            const userData = await socialBladeService.getInstagram(user);
            users.push(userData);
          }
        })
      );
      // Faz a requisição para o endpoint externo para cada username

      // Verifica se o dado retornado é válido
      if (users) {
        for (const user of users) {
          await saveProfile(user);
        }
      }

      res.status(200).json({ message: "Perfis salvos com sucesso!" });
    } catch (error) {
      // Verifica se o erro é uma instância de Error
      if (error instanceof Error) {
        res.status(500).json({
          error: "Erro ao processar os perfis",
          details: error.message,
        });
      } else {
        res
          .status(500)
          .json({ error: "Erro desconhecido ao processar os perfis" });
      }
    }
  }
);
router.post(
  "/new-instagram",
  async (req: Request, res: Response): Promise<any> => {
    const { username } = req.body;

    try {
      // Loop para cada username na lista
      // Faz a requisição para o endpoint externo para cada username

      if (!username) return;

      const response = await socialBladeService.getInstagram(username);

      // Verifica se o dado retornado é válido
      if (response) {
        // Chama o serviço para salvar a informação recebida no MongoDB
        await saveProfile(response);
      }

      res.status(200).json({ message: "Perfil salvo com sucesso!", username });
    } catch (error) {
      // Verifica se o erro é uma instância de Error
      if (error instanceof Error) {
        res.status(500).json({
          error: "Erro ao processar o perfil",
          details: error.message,
        });
      } else {
        res
          .status(500)
          .json({ error: "Erro desconhecido ao processar os perfil" });
      }
    }
  }
);
router.get("/instagrams", async (req: Request, res: Response): Promise<any> => {
  try {
    // Faz a requisição para o endpoint externo para cada username
    const response = await getInstagrams();

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
router.get(
  "/instagrams/update",
  async (req: Request, res: Response): Promise<any> => {
    try {
      // Faz a requisição para o endpoint externo para cada username
      await updateInstagrams();

      // Retorna os dados tipados como InstagramData[]
      return res.send({ message: "Dados atualizados com sucesso" });
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
  }
);

export default router; // Exporta o roteador
