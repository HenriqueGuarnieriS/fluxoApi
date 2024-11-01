import mongoose from "mongoose";

// Esquema principal para vereadores
const vereadorSchema = new mongoose.Schema({
  NM_CANDIDATO: { type: String, required: true },
  NM_URNA_CANDIDATO: { type: String, required: true },
  SG_PARTIDO: { type: String, required: true },
  NM_UE: { type: String, required: true },
  SG_UF: { type: String, required: true },
  SG_UF_NASCIMENTO: { type: String, required: true },
  DT_NASCIMENTO: { type: Date, required: true },
  DS_GENERO: { type: String, required: true },
  DS_GRAU_INSTRUCAO: { type: String, required: true },
  DS_COR_RACA: { type: String, required: true },
  DS_OCUPACAO: { type: String, required: true },
  DS_SIT_TOT_TURNO: { type: String, required: true },
  DS_CARGO: { type: String, required: true },
  CD_SIT_TOT_TURNO: { type: Number, required: true },
});

// Exportando o modelo de vereadores
const VereadorDoc = mongoose.model("Vereadores", vereadorSchema);
export default VereadorDoc;
