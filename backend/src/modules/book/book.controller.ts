import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Message } from 'src/commons/decorators/message.decorator';
import { TokenGuard } from 'src/commons/guards/token.guard';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Post('create')
  @Message('Success create book')
  @UseGuards(TokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    createBookDto: {
      title: string;
      author_name: string;
      publisher_name: string;
      year_published: number;
      quantity: number;
    },
  ) {
    if (!file) throw new BadRequestException('File required');
    return await this.bookService.create(file, {
      title: createBookDto.title,
      author_name: createBookDto.author_name,
      publisher_name: createBookDto.publisher_name,
      year_published: createBookDto.year_published,
      quantity: createBookDto.quantity,
    });
  }

  @Get()
  @Message('Success get all books')
  @UseGuards(TokenGuard)
  async find() {
    return await this.bookService.find();
  }

  @Get(':id')
  @Message('Success get book by id')
  @UseGuards(TokenGuard)
  async findById(@Param('id') id: string) {
    return this.bookService.findById(id);
  }

  @Put('update/:id')
  @UseGuards(TokenGuard)
  @Message('Success update book')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    updateBookDto: {
      title: string;
      author_name: string;
      publisher_name: string;
      year_published: number;
      quantity: number;
    },
  ) {
    console.log(file);
    return await this.bookService.update(id, file, updateBookDto);
  }

  @Delete('delete/:id')
  @UseGuards(TokenGuard)
  @Message('Success delete book')
  async delete(@Param('id') id: string) {
    console.log(id);
    await this.bookService.delete(id);
  }
}
