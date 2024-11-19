import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  async createComment(data: {
    user_id: number;
    book_id: number;
    borrowing_id: number;
    content: string;
  }) {
    const userQuery = `SELECT * FROM \`users\` WHERE \`id\` = ${data.user_id};`;
    const user = await this.prismaService.$queryRawUnsafe(userQuery);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const bookQuery = `SELECT * FROM \`books\` WHERE \`id\` = ${data.book_id};`;
    const book = await this.prismaService.$queryRawUnsafe(bookQuery);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const borrowingQuery = `
      SELECT * FROM \`Borrowings\`
      WHERE \`id\` = ${data.borrowing_id} AND \`user_id\` = ${data.user_id} AND \`book_id\` = ${data.book_id};
    `;
    const borrowing = await this.prismaService.$queryRawUnsafe(borrowingQuery);
    if (!borrowing) {
      throw new NotFoundException('Borrowing record not found');
    }

    const commentInsertQuery = `
      INSERT INTO \`comments\` (\`content\`, \`createdAt\`, \`user_id\`, \`book_id\`, \`borrowing_id\`)
      VALUES ('${data.content}', NOW(), ${data.user_id}, ${data.book_id}, ${data.borrowing_id});
    `;
    await this.prismaService.$queryRawUnsafe(commentInsertQuery);

    return { message: 'Comment created successfully' };
  }
}
