import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/shared/dto/error-response.dto';
import { InserirTarefaResponseDto } from './dto/inserir-tarefa-response.dto';
import { ListarTarefasResponseDto } from './dto/listar-tarefas-response.dto';
import { ObterTarefaResponseDto } from './dto/obter-tarefa-response.dto';
import { TarefaDto } from './dto/tarefa.dto';
import { TarefasService } from './tarefas.service';

// @ApiExtraModels(ErrorResponseDto)
@ApiTags('tarefas')
@Controller('tarefas')
export class TarefasController {
  constructor(private readonly tarefasService: TarefasService) {}

  @Get()
  async listarTarefas(): Promise<ListarTarefasResponseDto[]> {
    return this.tarefasService.listarTarefas(['id', 'nome', 'data']);
  }

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseDto,
  })
  @Get(':id')
  async obterTarefa(
    @Param('id', new ParseIntPipe())
    tarefaId: number,
  ): Promise<ObterTarefaResponseDto> {
    const tarefa = await this.tarefasService.obterTarefa(tarefaId);
    if (!tarefa) {
      throw new NotFoundException(`Tarefa [${tarefaId}] não localizada`);
    }

    return tarefa;
  }

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseDto,
  })
  @Post()
  async inserirTarefa(
    @Body() body: TarefaDto,
  ): Promise<InserirTarefaResponseDto> {
    const { id } = await this.tarefasService.inserirTarefa(body);
    return { id };
  }

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseDto,
  })
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async atualizarTarefa(
    @Param('id', new ParseIntPipe())
    tarefaId: number,
    @Body() body: TarefaDto,
  ): Promise<void> {
    const tarefa = await this.tarefasService.obterTarefa(tarefaId);
    if (!tarefa) {
      throw new NotFoundException(`Tarefa [${tarefaId}] não localizada`);
    }

    await this.tarefasService.atualizarTarefa(tarefa, body);
  }

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseDto,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async apagarTarefa(
    @Param('id', new ParseIntPipe())
    tarefaId: number,
  ): Promise<void> {
    const tarefa = await this.tarefasService.obterTarefa(tarefaId);
    if (!tarefa) {
      throw new NotFoundException(`Tarefa [${tarefaId}] não localizada`);
    }

    await this.tarefasService.apagarTarefa(tarefa);
  }
}
