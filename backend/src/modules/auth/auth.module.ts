import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { config, jwtConstant } from 'src/commons/constants/constanst';
import { TokenStrategy } from './strategies/token.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstant(config),
    }),
  ],
  providers: [AuthService, TokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
