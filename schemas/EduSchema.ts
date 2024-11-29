const mongoose = require("mongoose");
const { Schema } = mongoose;

// Subschema para os contadores de dependência
const EduDependenciaCountSchema = new Schema(
  {
    Federal: { type: Number, required: false },
    Estadual: { type: Number, required: false },
    Municipal: { type: Number, required: false },
    Privada: { type: Number, required: false },
  },
  { _id: false }
); // O campo _id é desativado aqui pois não é necessário

// Subschema para cada categoria (e.g., agua_potavel, energia_rede_publica)
const EduCategoriaSchema = new Schema(
  {
    nao: { type: EduDependenciaCountSchema, required: false },
    sim: { type: EduDependenciaCountSchema, required: false },
  },
  { _id: false }
);

// Schema principal para o documento do estado
const EduEstadoSchema = new Schema(
  {
    _id: {
      $oid: { type: String, required: true },
    },
    id: { type: String, required: true }, // Código do estado
    agua_potavel: { type: EduCategoriaSchema, required: false },
    energia_rede_publica: { type: EduCategoriaSchema, required: false },
    lixo_servico_coleta: { type: EduCategoriaSchema, required: false },
    agua_inexistente: { type: EduCategoriaSchema, required: false },
    energia_inexistente: { type: EduCategoriaSchema, required: false },
    esgoto_rede_publica: { type: EduCategoriaSchema, required: false },
    esgoto_inexistente: { type: EduCategoriaSchema, required: false },
    esgoto_fossa: { type: EduCategoriaSchema, required: false },
    esgoto_fossa_septica: { type: EduCategoriaSchema, required: false },
    banheiro: { type: EduCategoriaSchema, required: false },
    banheiro_pne: { type: EduCategoriaSchema, required: false },
    laboratorio_ciencias: { type: EduCategoriaSchema, required: false },
    laboratorio_informatica: { type: EduCategoriaSchema, required: false },
    quadra_esportes: { type: EduCategoriaSchema, required: false },
    terreirao: { type: EduCategoriaSchema, required: false },
    refeitorio: { type: EduCategoriaSchema, required: false },
    acessibilidade_inexistente: { type: EduCategoriaSchema, required: false },
  },
  { collection: "educacao" }
); // Nome da coleção pode ser 'estados'

// Exportando o modelo corretamente
const EduEscolasDoc = mongoose.model("Edu", EduEstadoSchema);
export default EduEscolasDoc;
