import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [JwtModule.register({}), PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
