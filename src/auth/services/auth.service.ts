import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import { PrismaService } from 'src/prisma/prisma.service';
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
      throw new ConflictException('User with this email already exists');
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

  signIn(dto: AuthDto) {
    return {
      id: 1,
      email: dto.email,
    };
  }

  async generateTokens(userId: number, email: string) {
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

    return { accessToken, refreshToken };
  }
}
