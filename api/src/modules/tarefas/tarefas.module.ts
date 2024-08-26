import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarefa } from './tarefa.entity';
import { TarefasController } from './tarefas.controller';
import { TarefasService } from './tarefas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tarefa])],
  controllers: [TarefasController],
  providers: [TarefasService],
})
export class TarefasModule {}
