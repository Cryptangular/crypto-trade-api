import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import * as express from 'express';
import { GetUser } from '../decorators/get-user.decorator';
import { AuthDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { AuthService } from '../services/auth.service';
import { ActiveUser } from '../types/active-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: AuthDto, @Res({ passthrough: true }) response: express.Response): Promise<ActiveUser> {
    const user = await this.authService.signUp(dto);
    const tokens = await this.authService.generateTokens(user.id, user.email);

    this.authService.setAuthCookies(response, tokens);

    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) response: express.Response): Promise<ActiveUser> {
    const user = await this.authService.signIn(dto);

    const tokens = await this.authService.generateTokens(user.id, user.email);

    this.authService.setAuthCookies(response, tokens);

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
    const tokens = await this.authService.generateTokens(user.id, user.email);

    this.authService.setAuthCookies(response, tokens);

    return user;
  }
}
