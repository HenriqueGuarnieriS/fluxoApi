import { InstagramUser } from "socialblade";
import InstagramDoc from "../schemas/InstagramSchema"; // Importando o modelo do Profile
import { SocialBladeService } from "../services/socialblade";
import { InstagramInterface } from "../interfaces/instagram";

// Serviço responsável por salvar um perfil no MongoDB
export const saveProfile = async (profileData: InstagramUser) => {
  try {
    const newProfile = new InstagramDoc(profileData);
    await newProfile.save();
    return newProfile;
  } catch (error) {
    // Verifica se o erro é uma instância de Error
    if (error instanceof Error) {
      throw new Error("Erro ao salvar o perfil no MongoDB: " + error.message);
    } else {
      throw new Error("Erro desconhecido ao salvar o perfil");
    }
  }
};

export const getInstagrams = async (): Promise<InstagramInterface[]> => {
  try {
    const instagrams = await InstagramDoc.find({}, { _id: 0, __v: 0 }).lean();
    return instagrams as InstagramInterface[];
  } catch {
    throw new Error("Falha ao buscar");
  }
};
export const getInstagram = async (
  username: string
): Promise<InstagramInterface> => {
  try {
    const instagram = await InstagramDoc.findOne(
      { "id.username": username },
      { _id: 0, __v: 0 }
    );
    return instagram as InstagramInterface;
  } catch {
    throw new Error("Falha ao buscar");
  }
};

export const updateInstagrams = async (): Promise<void> => {
  try {
    const instagrams = await InstagramDoc.find({}, { "id.username": 1 });
    const socialBladeService = new SocialBladeService();

    const socialbladedata = await Promise.all(
      instagrams.map(async (insta) =>
        socialBladeService.getInstagram(insta.id?.username)
      )
    );

    // Atualiza cada documento ou cria caso não exista
    for (const data of socialbladedata) {
      await InstagramDoc.updateOne(
        { "id.username": data.id.username }, // Filtro pelo username do Instagram
        { $set: data }, // Atualiza com os dados novos
        { upsert: true } // Se não existir, cria o documento
      );
    }
  } catch (error) {
    console.error("Erro ao atualizar/insert os dados do Instagram:", error);
  }
};

export const addNewInstagram = async (username: string) => {
  const socialBladeService = new SocialBladeService();
  try {
    const instagramData: InstagramUser = await socialBladeService.getInstagram(
      username
    );
    const newInstagram = new InstagramDoc(instagramData);
    await newInstagram.save();
    return { message: `Instagram data of ${username} added` };
  } catch (error) {
    throw new Error("Erro ao salvar o perfil no MongoDB: " + error);
  }
};
