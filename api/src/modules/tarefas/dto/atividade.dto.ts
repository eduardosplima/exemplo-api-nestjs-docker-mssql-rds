import { IsNotEmpty, IsString } from 'class-validator';

export class AtividadeDto {
  @IsString()
  @IsNotEmpty()
  descricao!: string;
}
