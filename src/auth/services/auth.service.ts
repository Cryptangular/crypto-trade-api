import { Injectable } from '@nestjs/common';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  register(dto: AuthDto) {
    return {
      id: 1,
      email: dto.email,
    };
  }

  login(dto: AuthDto) {
    return {
      id: 1,
      email: dto.email,
    };
  }
}
