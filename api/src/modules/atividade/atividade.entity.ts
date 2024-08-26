import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tarefa } from '../tarefas/tarefa.entity';

@Entity()
export class Atividade {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  descricao!: string;

  @ManyToOne(() => Tarefa, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  tarefa!: Tarefa;
}
