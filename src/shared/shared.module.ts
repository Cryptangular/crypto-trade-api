import { Module } from '@nestjs/common';
import { CipherService } from './services/cipher.service';

@Module({
  providers: [CipherService],
  exports: [CipherService],
})
export class SharedModule {}
