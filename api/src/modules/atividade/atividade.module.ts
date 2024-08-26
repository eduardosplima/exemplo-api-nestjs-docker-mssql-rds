import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atividade } from './atividade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Atividade])],
})
export class AtividadeModule {}
