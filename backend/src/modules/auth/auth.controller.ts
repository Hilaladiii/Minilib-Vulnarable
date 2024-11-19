import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Message } from 'src/commons/decorators/message.decorator';
import { GetCurrentUserId } from 'src/commons/decorators/get-current-user-id.decorator';
import { TokenGuard } from 'src/commons/guards/token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Message('Success login into your account')
  async login(@Body() data: { email: string; password: string }) {
    return await this.authService.login(data);
  }

  @Post('logout')
  @Message('Success logout into your account')
  @UseGuards(TokenGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number) {
    return await this.authService.logout(userId);
  }
}
