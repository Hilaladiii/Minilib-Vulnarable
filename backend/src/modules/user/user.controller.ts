import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Message } from 'src/commons/decorators/message.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @Message('Success register your account')
  async register(
    @Body() data: { email: string; username: string; password: string },
  ) {
    console.log(data);
    return await this.userService.register(data);
  }

  @Get()
  @Message('Success get all users')
  async find() {
    return await this.userService.find();
  }

  @Get(':id')
  @Message('Success get user by id')
  async findById(@Param('id') id: string) {
    return await this.userService.findByid(id);
  }

  @Put('block/:id')
  @Message('Success block user')
  async block(@Param('id') id: string) {
    return await this.userService.block(id);
  }

  @Put('unblock/:id')
  @Message('Success unblock user')
  async unBlock(@Param('id') id: string) {
    return await this.userService.unBlock(id);
  }
}
