import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Atividade } from '../atividade/atividade.entity';

@Entity()
export class Tarefa {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  nome!: string;

  @Column('varchar')
  descricao!: string;

  @Column('datetime')
  data!: Date;

  @OneToMany(() => Atividade, (atividade) => atividade.tarefa, {
    cascade: true,
    eager: false,
  })
  atividades!: Atividade[];
}
