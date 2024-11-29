import { EduEstadoDocument } from "../interfaces/edu";
import EduEscolasDoc from "../schemas/EduSchema";

export const getEscolasPorEstado = async (): Promise<EduEstadoDocument[]> => {
  try {
    const escolasPorEstado = await EduEscolasDoc.find(
      {},
      { _id: 0, __v: 0 }
    ).lean();
    return escolasPorEstado as EduEstadoDocument[];
  } catch {
    throw new Error("Falha ao buscar");
  }
};
