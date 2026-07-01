import { IsNotEmpty, IsString } from 'class-validator';

export class GetKlinesDto {
  @IsString()
  @IsNotEmpty()
  symbol!: string;

  @IsString()
  @IsNotEmpty()
  interval!: string;
}
