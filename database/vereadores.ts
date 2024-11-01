import PartidoDoc from "../schemas/PartidoSchema";
import VereadorDoc from "../schemas/VereadorSchema";

export const cacheAllAggregations = async () => {
  try {
    // Agregação para obter as informações necessárias de cada partido
    const partidosData = await VereadorDoc.aggregate([
      {
        $addFields: {
          dataNascimento: {
            $dateFromString: {
              dateString: "$DT_NASCIMENTO",
              format: "%d/%m/%Y",
            },
          },
        },
      },
      {
        $addFields: {
          idade: {
            $dateDiff: {
              startDate: "$dataNascimento",
              endDate: new Date(),
              unit: "year",
            },
          },
        },
      },
      {
        $group: {
          _id: "$SG_PARTIDO",
          raca: { $push: "$DS_COR_RACA" },
          genero: { $push: "$DS_GENERO" },
          instrucao: { $push: "$DS_GRAU_INSTRUCAO" },
          mediaIdade: { $avg: "$idade" },
        },
      },
      {
        $project: {
          _id: 0,
          sigla_partido: "$_id",
          mediaIdade: 1,
          // Sub-agregações para contar cada tipo de raça, gênero e instrução dentro de cada partido
          raca: {
            $map: {
              input: { $setUnion: "$raca" },
              as: "tipo",
              in: {
                tipo: "$$tipo",
                count: {
                  $size: {
                    $filter: {
                      input: "$raca",
                      as: "item",
                      cond: { $eq: ["$$item", "$$tipo"] },
                    },
                  },
                },
              },
            },
          },
          genero: {
            $map: {
              input: { $setUnion: "$genero" },
              as: "tipo",
              in: {
                tipo: "$$tipo",
                count: {
                  $size: {
                    $filter: {
                      input: "$genero",
                      as: "item",
                      cond: { $eq: ["$$item", "$$tipo"] },
                    },
                  },
                },
              },
            },
          },
          instrucao: {
            $map: {
              input: { $setUnion: "$instrucao" },
              as: "tipo",
              in: {
                tipo: "$$tipo",
                count: {
                  $size: {
                    $filter: {
                      input: "$instrucao",
                      as: "item",
                      cond: { $eq: ["$$item", "$$tipo"] },
                    },
                  },
                },
              },
            },
          },
        },
      },
      { $sort: { sigla_partido: 1 } },
    ]);

    // Para cada partido, cria ou atualiza um documento separado na coleção
    for (const partidoData of partidosData) {
      await PartidoDoc.updateOne(
        { sigla_partido: partidoData.sigla_partido },
        {
          $set: {
            media_idade: partidoData.mediaIdade,
            raca: partidoData.raca,
            genero: partidoData.genero,
            instrucao: partidoData.instrucao,
          },
        },
        { upsert: false } // Atualiza apenas se o documento existir
      );
    }

    console.log("Agregações salvas com sucesso nos documentos dos partidos.");
  } catch (error) {
    console.error("Erro ao executar e salvar agregações:", error);
    throw error;
  }
};

export const getAggregationData = async () => {
  return await PartidoDoc.find({}, { _id: 0, __v: 0 }).lean();
};
