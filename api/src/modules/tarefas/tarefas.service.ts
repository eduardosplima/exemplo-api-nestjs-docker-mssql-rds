import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Atividade } from '../atividade/atividade.entity';
import { TarefaDto } from './dto/tarefa.dto';
import { Tarefa } from './tarefa.entity';

@Injectable()
export class TarefasService {
  constructor(
    @InjectRepository(Tarefa)
    private readonly tarefaRepository: Repository<Tarefa>,
  ) {}

  private async salvarTarefa(
    tarefaDto: TarefaDto,
    tarefa: Tarefa = new Tarefa(),
  ): Promise<Tarefa> {
    tarefa.nome = tarefaDto.nome;
    tarefa.descricao = tarefaDto.descricao;
    tarefa.data = tarefaDto.data;
    tarefa.atividades = [];

    tarefaDto.atividades?.forEach((atividadeDto) => {
      const atividade = new Atividade();
      atividade.descricao = atividadeDto.descricao;
      atividade.tarefa = tarefa;
      tarefa.atividades.push(atividade);
    });

    return this.tarefaRepository.save(tarefa);
  }

  async listarTarefas<K extends keyof Tarefa>(
    select: K[],
  ): Promise<Pick<Tarefa, K>[]> {
    return this.tarefaRepository.find({ select });
  }

  async obterTarefa(tarefaId: number): Promise<Tarefa | null> {
    return this.tarefaRepository.findOne({
      where: { id: tarefaId },
      loadEagerRelations: true,
    });
  }

  async inserirTarefa(tarefaDto: TarefaDto): Promise<Tarefa> {
    return this.salvarTarefa(tarefaDto);
  }

  async atualizarTarefa(tarefa: Tarefa, tarefaDto: TarefaDto): Promise<Tarefa> {
    return this.salvarTarefa(tarefaDto, tarefa);
  }

  async apagarTarefa(tarefa: Tarefa): Promise<void> {
    await this.tarefaRepository.remove(tarefa);
  }
}
