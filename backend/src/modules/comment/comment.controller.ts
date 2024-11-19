import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { TokenGuard } from 'src/commons/guards/token.guard';
import { GetCurrentUserId } from 'src/commons/decorators/get-current-user-id.decorator';
import { Message } from 'src/commons/decorators/message.decorator';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  @UseGuards(TokenGuard)
  async createComment(
    @GetCurrentUserId() user_id: number,
    @Body()
    data: {
      book_id: string;
      borrowing_id: string;
      content: string;
    },
  ) {
    return await this.commentService.createComment({
      user_id,
      book_id: parseInt(data.book_id),
      borrowing_id: parseInt(data.borrowing_id),
      content: data.content,
    });
  }

  @Get(':id')
  @Message('Success get comments by book id')
  async findByBookId(@Param('id') id: number) {
    return await this.commentService.findByBookId(id);
  }
}
