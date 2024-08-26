import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AtividadeDto } from './atividade.dto';

export class TarefaDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsString()
  @IsNotEmpty()
  descricao!: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  data!: Date;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => AtividadeDto)
  atividades?: AtividadeDto[];
}
