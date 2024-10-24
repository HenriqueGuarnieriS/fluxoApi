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

// export const getInstagrams = async (): Promise<InstagramInterface[]> => {
//   try {
//     const instagrams = await InstagramDoc.find(
//       {},
//       { "id.username": 1, _id: 0 }
//     ).lean();
//     return instagrams as InstagramInterface[];
//   } catch {
//     throw new Error("Falha ao buscar");
//   }
// };
export const getInstagrams = async (): Promise<InstagramInterface[]> => {
  try {
    const instagrams = await InstagramDoc.find({}, { _id: 0, __v: 0 }).lean();
    return instagrams as InstagramInterface[];
  } catch {
    throw new Error("Falha ao buscar");
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
