import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { AuthErrors } from '../constants/auth-errors';
import { ActiveUser } from '../types/active-user';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest<TUser = ActiveUser>(err: unknown, user: TUser | false, info: unknown): TUser {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException(AuthErrors.ACCESS_TOKEN_EXPIRED);
    }

    if (info instanceof Error && info.message === 'No auth token') {
      throw new UnauthorizedException(AuthErrors.ACCESS_TOKEN_MISSING);
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
