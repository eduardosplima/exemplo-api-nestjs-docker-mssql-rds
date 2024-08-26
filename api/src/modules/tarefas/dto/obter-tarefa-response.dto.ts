class AtividadeDto {
  descricao!: string;
}

export class ObterTarefaResponseDto {
  id!: number;

  nome!: string;

  descricao!: string;

  data!: Date;

  atividades?: AtividadeDto[];
}
