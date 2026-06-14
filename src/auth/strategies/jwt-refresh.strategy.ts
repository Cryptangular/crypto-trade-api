import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_COOKIES } from '../constants/auth.constants';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies[AUTH_COOKIES.REFRESH];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: { sub: string; email: string }) {
    const refreshToken = request?.cookies[AUTH_COOKIES.REFRESH];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.validateRefreshToken(payload.sub, refreshToken);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
