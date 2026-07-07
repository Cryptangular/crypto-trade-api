import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MarketsController } from './controllers/markets/markets.controller';
import { MarketsService } from './services/markets.service';

@Module({
  imports: [HttpModule],
  providers: [MarketsService],
  controllers: [MarketsController],
})
export class MarketsModule {}
