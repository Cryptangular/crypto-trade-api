import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetOrderBookDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase().replace(/[^A-Z0-9]/g, ''))
  symbol: string;
}
