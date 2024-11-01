import mongoose from "mongoose";

const AggregationSchema = new mongoose.Schema({
  partido: {
    type: String,
    required: true,
  },
  raca: [
    {
      tipo: String, // Ex: "BRANCA", "PARDA"
      count: Number,
      _id: false, // Desativa o campo _id neste subdocumento
    },
  ],
  genero: [
    {
      tipo: String, // Ex: "FEMININO", "MASCULINO"
      count: Number,
      _id: false, // Desativa o campo _id neste subdocumento
    },
  ],
  instrucao: [
    {
      tipo: String, // Ex: "SUPERIOR COMPLETO", "ENSINO MÉDIO COMPLETO"
      count: Number,
      _id: false, // Desativa o campo _id neste subdocumento
    },
  ],
  mediaIdade: {
    type: Number,
    default: null,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AggregatedData", AggregationSchema);
