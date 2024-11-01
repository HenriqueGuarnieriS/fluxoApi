import mongoose from "mongoose";

// Esquema de eleitos por estado
const eleitosPorEstadoSchema = new mongoose.Schema(
  {
    sigla_uf: { type: String, required: true },
    total_eleitos: { type: Number, required: true },
  },
  { _id: false }
);

// Esquema de agregações de raça, gênero e instrução
const aggregationSchema = new mongoose.Schema(
  {
    tipo: { type: String, required: true }, // Ex: "BRANCA", "FEMININO", "SUPERIOR COMPLETO"
    count: { type: Number, required: true },
  },
  { _id: false }
);

// Esquema principal para partido
const partidoSchema = new mongoose.Schema({
  sigla_partido: { type: String, required: true },
  total_eleitos_nacional: { type: Number, required: true },
  eleitos_por_estado: { type: [eleitosPorEstadoSchema], required: true },
  media_idade: { type: Number, default: null },
  raca: { type: [aggregationSchema], default: [] },
  genero: { type: [aggregationSchema], default: [] },
  instrucao: { type: [aggregationSchema], default: [] },
});

// Exportando o modelo
const PartidoDoc = mongoose.model("Partidos", partidoSchema);
export default PartidoDoc;
