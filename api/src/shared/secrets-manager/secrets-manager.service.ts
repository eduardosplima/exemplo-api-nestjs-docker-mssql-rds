import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SecretsManagerService {
  private readonly client: SecretsManagerClient = new SecretsManagerClient();

  async fetchSecrets<T extends Record<string, unknown>>(
    secretName: string,
  ): Promise<T> {
    const response = await this.client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      }),
    );
    return JSON.parse(response.SecretString as string);
  }
}
