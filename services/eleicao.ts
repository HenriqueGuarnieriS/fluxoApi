import { PartidoInterface } from "../interfaces/partido";
import PartidoDoc from "../schemas/PartidoSchema";

export const getPartidos = async (): Promise<PartidoInterface[]> => {
  try {
    const instagrams = await PartidoDoc.find({}, { _id: 0, __v: 0 })
      .sort({ total_eleitos_nacional: -1 })
      .lean();
    return instagrams as PartidoInterface[];
  } catch {
    throw new Error("Falha ao buscar");
  }
};
