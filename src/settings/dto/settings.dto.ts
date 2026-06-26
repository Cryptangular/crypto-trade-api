import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SettingsRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(20, 80)
  apiKey: string;

  @IsString()
  @IsNotEmpty()
  @Length(20, 80)
  secretKey: string;
}

export class SettingsResponseDTO {
  apiKey: string | null;
  hasSecret: boolean;
}
