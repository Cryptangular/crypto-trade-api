import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import * as express from 'express';
import { AUTH_COOKIES, BASE_COOKIE_OPTIONS, COOKIE_TIME } from '../constants/auth.constants';
import { GetUser } from '../decorators/get-user.decorator';
import { AuthDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { AuthService } from '../services/auth.service';
import { ActiveUser } from '../types/active-user';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: AuthDto, @Res({ passthrough: true }) response: express.Response): Promise<ActiveUser> {
    const user = await this.authService.signUp(dto);
    await this.processAuthentication(response, user);
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) response: express.Response): Promise<ActiveUser> {
    const user = await this.authService.signIn(dto);
    await this.processAuthentication(response, user);
    return user;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@GetUser() user: ActiveUser): ActiveUser {
    return user;
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@GetUser() user: ActiveUser, @Res({ passthrough: true }) response: express.Response) {
    await this.processAuthentication(response, user);
    return user;
  }

  private async processAuthentication(response: express.Response, user: ActiveUser): Promise<void> {
    const tokens = await this.authService.generateTokens(user.id, user.email);

    response.cookie(AUTH_COOKIES.ACCESS, tokens.accessToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: COOKIE_TIME.ACCESS_TOKEN,
    });

    response.cookie(AUTH_COOKIES.REFRESH, tokens.refreshToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: COOKIE_TIME.REFRESH_TOKEN,
    });
  }
}
