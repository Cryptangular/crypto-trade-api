import * as crypto from 'node:crypto';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CRYPTO_CONFIG } from '../constants/crypto.constants';

@Injectable()
export class CipherService {
  private readonly logger = new Logger(CipherService.name);
  private readonly algorithm = CRYPTO_CONFIG.ALGORITHM;
  private readonly key: Buffer;

  constructor(private readonly configService: ConfigService) {
    const secret = this.configService.getOrThrow<string>('ENCRYPTION_KEY');
    this.key = Buffer.from(secret, 'hex');

    if (this.key.length !== 32) {
      throw new Error(`ENCRYPTION_KEY must be ${CRYPTO_CONFIG.KEY_LENGTH_BYTES * 2} characters long`);
    }
  }

  encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(CRYPTO_CONFIG.IV_LENGTH_BYTES);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
      return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    } catch (error) {
      this.logger.error('Encryption failed', error instanceof Error ? error.message : String(error));
      throw new InternalServerErrorException('Encryption process failed');
    }
  }

  decrypt(encryptedText: string): string {
    try {
      const [ivHex, encryptedHex] = encryptedText.split(':');
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, Buffer.from(ivHex, 'hex'));
      const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedHex, 'hex')), decipher.final()]);

      return decrypted.toString();
    } catch (error) {
      this.logger.error('Decryption failed', error instanceof Error ? error.message : String(error));
      throw new InternalServerErrorException('Decryption process failed');
    }
  }
}
