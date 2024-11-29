export interface DocumentId {
  $oid: string;
}

export interface EduDependenciaCount {
  Federal?: number;
  Estadual?: number;
  Municipal?: number;
  Privada?: number;
}

export interface EduCategoria {
  nao?: EduDependenciaCount;
  sim?: EduDependenciaCount;
}

export interface EduEstadoDocument {
  _id: DocumentId;
  id: string;
  agua_potavel: EduCategoria;
  energia_rede_publica: EduCategoria;
  lixo_servico_coleta: EduCategoria;
  agua_inexistente: EduCategoria;
  energia_inexistente: EduCategoria;
  esgoto_rede_publica: EduCategoria;
  esgoto_inexistente: EduCategoria;
  esgoto_fossa: EduCategoria;
  esgoto_fossa_septica: EduCategoria;
  banheiro: EduCategoria;
  banheiro_pne: EduCategoria;
  laboratorio_ciencias: EduCategoria;
  laboratorio_informatica: EduCategoria;
  quadra_esportes: EduCategoria;
  terreirao: EduCategoria;
  refeitorio: EduCategoria;
  acessibilidade_inexistente: EduCategoria;
}
