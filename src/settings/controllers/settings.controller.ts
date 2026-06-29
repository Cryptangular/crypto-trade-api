import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, UseGuards, UsePipes } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ActiveUser } from 'src/auth/types/active-user';
import { SETTINGS_CODES } from '../constants/constants';
import { SettingsRequestDto, SettingsResponseDTO } from '../dto/settings.dto';
import { SettingsValidationPipe } from '../pipes/settings-validation.pipe';
import { SettingsService } from '../services/settings.service';
import { SettingsResponse } from '../types/types';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@GetUser() user: ActiveUser): Promise<SettingsResponse<SettingsResponseDTO>> {
    const settings = await this.settingsService.getSettings(user.id);

    if (!settings) {
      return { data: { apiKey: null, hasSecret: false }, code: SETTINGS_CODES.SETTINGS_GOT };
    }

    return {
      data: {
        apiKey: settings.apiKey,
        hasSecret: true,
      },
      code: SETTINGS_CODES.SETTINGS_GOT,
    };
  }

  @Post()
  @UsePipes(new SettingsValidationPipe())
  @HttpCode(HttpStatus.OK)
  async setSettings(
    @GetUser() user: ActiveUser,
    @Body() dto: SettingsRequestDto,
  ): Promise<SettingsResponse<SettingsResponseDTO>> {
    const { apiKey, secretKey } = await this.settingsService.setSettings(user.id, dto);

    return {
      data: {
        apiKey,
        hasSecret: !!secretKey,
      },
      code: SETTINGS_CODES.SETTINGS_SETTED,
    };
  }

  @Delete()
  async removeSettings(@GetUser() user: ActiveUser): Promise<SettingsResponse<null>> {
    await this.settingsService.removeSettings(user.id);
    return { data: null, code: SETTINGS_CODES.SETTINGS_REMOVED };
  }
}
