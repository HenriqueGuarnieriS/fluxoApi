import express from "express";
import { getInstagrams, saveProfile } from "../database/mongo";
import { Request, Response } from "express";
import { SocialBladeService } from "../services/socialblade";

const router = express.Router(); // Cria o roteador express

export const instagramAccounts = [
  {
    city: "São Paulo",
    state: "São Paulo",
    name: "Guto Zacarias",
    instagram: "gutozacariasmbl",
    socialBlade: {},
  },
  {
    city: "São Paulo",
    state: "São Paulo",
    name: "Arthur do Val",
    instagram: "arthurmoledoval",
    socialBlade: {},
  },
  {
    city: "Curitiba",
    state: "Paraná",
    name: "João Bettega",
    instagram: "bettega_",
    socialBlade: {},
  },
  {
    city: "Rio de Janeiro",
    state: "Rio de Janeiro",
    name: "Gabriel Costenaro",
    instagram: "costenarorj",
    socialBlade: {},
  },
  {
    city: "São Paulo",
    state: "São Paulo",
    name: "Renato Battista",
    instagram: "renatobattistambl",
    socialBlade: {},
  },
  {
    city: "Salto",
    state: "São Paulo",
    name: "Kim Kataguiri",
    instagram: "kimkataguiri",
    socialBlade: {},
  },
  {
    city: "Natal",
    state: "Rio Grande do Norte",
    name: "Matheus Faustino",
    instagram: "faustinorn",
    socialBlade: {},
  },
  {
    city: "São Paulo",
    state: "São Paulo",
    name: "Amanda Vettorazzo",
    instagram: "amanda.vettorazzo",
    socialBlade: {},
  },
  {
    city: "São Paulo",
    state: "São Paulo",
    name: "renansantosmbl",
    instagram: "renansantosmbl",
    socialBlade: {},
  },
];
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

    try {
      const profiles = [];

      // Loop para cada username na lista
      for (const username of instagramAccounts) {
        try {
          // Faz a requisição para o endpoint externo para cada username
          const response = await socialBladeService.getInstagram(
            username.instagram
          );

          // Verifica se o dado retornado é válido
          if (response) {
            // Chama o serviço para salvar a informação recebida no MongoDB
            const savedProfile = await saveProfile(response);
            profiles.push(savedProfile);
          }
        } catch (error) {
          // Verifica se o erro é uma instância de Error
          if (error instanceof Error) {
            console.error(
              `Erro ao buscar o perfil de ${username.instagram}:`,
              error.message
            );
          } else {
            console.error(
              `Erro desconhecido ao buscar o perfil de ${username.instagram}`
            );
          }
        }
      }

      res.status(200).json({ message: "Perfis salvos com sucesso!", profiles });
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
    console.log(response);

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
