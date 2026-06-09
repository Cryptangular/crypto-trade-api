import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}
