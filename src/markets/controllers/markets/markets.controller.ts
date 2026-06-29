import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from 'src/markets/dto/pagination.dto';
import { MarketsService } from 'src/markets/services/markets.service';
import { MarketsResponse } from 'src/markets/types/markets';

@Controller('tokens')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}
  @Get()
  getTokens(@Query() query: PaginationDto): MarketsResponse {
    return this.marketsService.getTokens(query.page, query.limit);
  }
}
