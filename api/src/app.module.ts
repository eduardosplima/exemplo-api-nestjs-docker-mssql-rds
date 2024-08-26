import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AtividadeModule } from './modules/atividade/atividade.module';
import { TarefasModule } from './modules/tarefas/tarefas.module';
import { DatabaseModule } from './shared/database/database.module';

@Module({
  imports: [DatabaseModule, AtividadeModule, TarefasModule],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          stopAtFirstError: true,
          whitelist: true,
        }),
    },
  ],
})
export class AppModule {}
