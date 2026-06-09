import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import * as express from 'express';
import { COOKIE_TIME } from '../constants/auth.constants';
import { AuthDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: AuthDto, @Res({ passthrough: true }) response: express.Response) {
    const user = await this.authService.signUp(dto);
    const tokens = await this.authService.generateTokens(user.id, user.email);

    this.setTokenCookies(response, tokens.accessToken, tokens.refreshToken);

    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  private setTokenCookies(response: express.Response, accessToken: string, refreshToken: string) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    response.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: COOKIE_TIME.ACCESS_TOKEN,
    });

    response.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: COOKIE_TIME.REFRESH_TOKEN,
    });
  }
}
