interface EleitosPorEstado {
  sigla_uf: string;
  total_eleitos: number;
}

export interface PartidoInterface {
  sigla_partido: string;
  total_eleitos_nacional: number;
  eleitos_por_estado: EleitosPorEstado[];
}
