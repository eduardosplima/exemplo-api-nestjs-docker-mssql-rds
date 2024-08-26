import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { SecretsManagerModule } from '../secrets-manager/secrets-manager.module';
import { SecretsManagerService } from '../secrets-manager/secrets-manager.service';

type DatabaseSecrets = {
  engine?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  dbname?: string;
  dbschema?: string;
  synchronize?: boolean;
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SecretsManagerModule],
      inject: [SecretsManagerService],
      useFactory: async (secretsManagerService: SecretsManagerService) => {
        let databaseSecrets: DatabaseSecrets;

        if (process.env.NODE_ENV === 'aws') {
          databaseSecrets = await secretsManagerService.fetchSecrets(
            process.env.DATABASE_SECRET as string,
          );
        } else {
          databaseSecrets = {
            host: process.env.MSSQL_HOST,
            port: Number.parseInt(process.env.MSSQL_PORT ?? '1433', 10),
            username: process.env.MSSQL_USER,
            password: process.env.MSSQL_PSWD,
            dbname: process.env.MSSQL_DATABASE,
            dbschema: process.env.MSSQL_SCHEMA,
            synchronize: process.env.MSSQL_SYNC === 'true',
          };
        }

        return {
          type: 'mssql',
          host: databaseSecrets.host,
          port: databaseSecrets.port,
          username: databaseSecrets.username,
          password: databaseSecrets.password,
          database: databaseSecrets.dbname,
          schema: databaseSecrets.dbschema,
          options: { trustServerCertificate: true },
          synchronize: databaseSecrets.synchronize,
          entities: [
            resolve(__dirname, '..', '..', 'modules/**/*.entity.{js,ts}'),
          ],
        };
      },
    }),
  ],
})
export class DatabaseModule {}
