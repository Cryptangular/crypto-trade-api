import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MarketsService } from './services/markets.service';

@Module({
  imports: [HttpModule],
  providers: [MarketsService],
})
export class MarketsModule {}
