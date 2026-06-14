import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as express from 'express';
import type { StringValue } from 'ms';
import { PrismaService } from 'src/prisma/prisma.service';
import { AUTH_COOKIES, BASE_COOKIE_OPTIONS, COOKIE_TIME } from '../constants/auth.constants';
import { AuthErrors } from '../constants/auth-errors';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async signUp(dto: AuthDto) {
    const { email, password } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(AuthErrors.EMAIL_ALREADY_EXISTS);
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async signIn(dto: AuthDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET') || 'default_access';

    const accessExpires = this.configService.get<StringValue>('JWT_ACCESS_EXPIRATION') || '15m';

    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'default_refresh';
    const refreshExpires = this.configService.get<StringValue>('JWT_REFRESH_EXPIRATION') || '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpires,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpires,
      }),
    ]);

    await this.updateRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const saltRounds = 10;
    const hashedToken = await bcrypt.hash(refreshToken, saltRounds);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  setAuthCookies(response: express.Response, tokens: { accessToken: string; refreshToken: string }) {
    response.cookie(AUTH_COOKIES.ACCESS, tokens.accessToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: COOKIE_TIME.ACCESS_TOKEN,
    });

    response.cookie(AUTH_COOKIES.REFRESH, tokens.refreshToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: COOKIE_TIME.REFRESH_TOKEN,
    });
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.refreshToken) {
      return null;
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isRefreshTokenValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async removeRefreshToken(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
