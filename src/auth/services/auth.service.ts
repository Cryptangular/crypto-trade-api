import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import { PrismaService } from 'src/prisma/prisma.service';
import { SECURITY_CONFIG } from '../constants/auth.constants';
import { AuthErrors } from '../constants/auth-errors';
import { AuthDto } from '../dto/auth.dto';
import { ActiveUser } from '../types/active-user';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async signUp(dto: AuthDto): Promise<ActiveUser> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException(AuthErrors.EMAIL_ALREADY_EXISTS);
    }

    const passwordHash = await bcrypt.hash(dto.password, SECURITY_CONFIG.SALT_ROUNDS_PASSWORD);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
      },
    });

    return this.mapToActiveUser(user);
  }

  async signIn(dto: AuthDto): Promise<ActiveUser> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException(AuthErrors.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException(AuthErrors.INVALID_CREDENTIALS);
    }
    return this.mapToActiveUser(user);
  }

  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');

    const accessExpires = this.configService.get<StringValue>('JWT_ACCESS_EXPIRATION');

    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const refreshExpires = this.configService.get<StringValue>('JWT_REFRESH_EXPIRATION');

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
    const hashedToken = await bcrypt.hash(refreshToken, SECURITY_CONFIG.SALT_ROUNDS_REFRESH);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }

  async validateRefreshToken(userId: string, refreshToken: string): Promise<ActiveUser | null> {
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

    return this.mapToActiveUser(user);
  }

  async removeRefreshToken(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  private mapToActiveUser(user: User): ActiveUser {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
