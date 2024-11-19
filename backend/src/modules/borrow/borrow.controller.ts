import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { STATUS } from '@prisma/client';
import { TokenGuard } from 'src/commons/guards/token.guard';
import { Message } from 'src/commons/decorators/message.decorator';
import { GetCurrentUserId } from 'src/commons/decorators/get-current-user-id.decorator';

@Controller('borrow')
export class BorrowController {
  constructor(private borrowService: BorrowService) {}

  @Post(':id')
  @UseGuards(TokenGuard)
  @Message('Success create borrow')
  async create(@Param('id') id: string, @GetCurrentUserId() userId: string) {
    if (!id) throw new BadRequestException('book id required');
    await this.borrowService.create(id, userId);
  }

  @Put('return/:id')
  @UseGuards(TokenGuard)
  @Message('Success return book')
  async returnBook(@Param('id') id: string) {
    await this.borrowService.returnBook(id);
  }

  @Get()
  @Message('Success get borrow')
  async find(@Query('type') type: STATUS) {
    if (!Object.values(STATUS).includes(type))
      throw new BadRequestException('invalid status type');
    return await this.borrowService.find(type);
  }

  @Get('/user')
  @UseGuards(TokenGuard)
  @Message('Success get borrow user')
  async findByUser(@GetCurrentUserId() userId: string) {
    return await this.borrowService.findUser(userId);
  }

  @Get(':id')
  @Message('Success get borrow by id')
  async findById(@Param('id') id: string) {
    return await this.borrowService.findById(id);
  }
}
