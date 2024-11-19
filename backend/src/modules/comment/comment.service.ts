import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  async createComment(data: {
    user_id: number;
    book_id: number;
    borrowing_id: number;
    content: string;
  }) {
    const user: any = await this.prismaService.$queryRaw(
      Prisma.sql`SELECT * FROM users WHERE id = ${data.user_id};`,
    );
    if (!user.length) {
      throw new NotFoundException('User not found');
    }

    const book: any = await this.prismaService.$queryRaw(
      Prisma.sql`SELECT * FROM books WHERE id = ${data.book_id};`,
    );
    if (!book.length) {
      throw new NotFoundException('Book not found');
    }

    const borrowing: any = await this.prismaService.$queryRaw(
      Prisma.sql`SELECT * FROM borrowings 
                  WHERE id = ${data.borrowing_id} 
                    AND user_id = ${data.user_id} 
                    AND book_id = ${data.book_id};`,
    );
    if (!borrowing.length) {
      throw new NotFoundException('Borrowing record not found');
    }

    await this.prismaService.$executeRaw(
      Prisma.sql`INSERT INTO comments 
                  (content, createdAt, user_id, book_id, borrowing_id) 
                  VALUES (${data.content}, NOW(), ${data.user_id}, ${data.book_id}, ${data.borrowing_id});`,
    );

    return { message: 'Comment created successfully' };
  }

  async findByBookId(id: number) {
    const bookQuery = `SELECT * FROM \`books\` WHERE \`id\` = ${id};`;
    const book = await this.prismaService.$queryRawUnsafe(bookQuery);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const commentsQuery = `
    SELECT 
      c.\`id\`,
      c.\`content\`,
      c.\`createdAt\`,
      u.\`username\`
    FROM \`comments\` c
    INNER JOIN \`users\` u ON c.\`user_id\` = u.\`id\`
    WHERE c.\`book_id\` = ${id}
    ORDER BY c.\`createdAt\` DESC;
  `;
    const comments = await this.prismaService.$queryRawUnsafe(commentsQuery);
    return comments;
  }
}
