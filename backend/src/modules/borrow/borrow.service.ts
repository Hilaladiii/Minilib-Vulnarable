import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BorrowService {
  constructor(private prismaService: PrismaService) {}

  async create(book_id: string, user_id: string) {
    const userQuery = `SELECT * FROM \`users\` WHERE \`id\` = '${user_id}';`;
    const user = await this.prismaService.$queryRawUnsafe(userQuery);

    if (!user) throw new NotFoundException('User not found');
    if (user[0].isBlocked)
      throw new BadRequestException(
        'You are blocked from system, please contact admin in offline library',
      );

    const bookQuery = `SELECT * FROM \`books\` WHERE \`id\` = '${book_id}';`;
    const book = await this.prismaService.$queryRawUnsafe(bookQuery);

    if (!book) throw new NotFoundException('Book not found');
    if (book[0].quantity == 0)
      throw new NotFoundException('Book not available');

    const borrowQuery = `
      SELECT * FROM \`borrowings\`
      WHERE \`book_id\` = '${book_id}' AND \`user_id\` = '${user_id}' AND \`status\` = 'BORROWED';
    `;
    const userBorrow = await this.prismaService.$queryRawUnsafe(borrowQuery);

    if (userBorrow)
      throw new BadRequestException('You only have to borrow one book');

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(borrowDate.getDate() + 3);

    const newQuantity = book[0].quantity - 1;

    const borrowInsertQuery = `
      INSERT INTO \`borrowings\` (\`due_date\`, \`borrow_date\`, \`status\`, \`user_id\`, \`book_id\`)
      VALUES ('${dueDate.toISOString()}', '${borrowDate.toISOString()}', 'BORROWED', '${user_id}', '${book_id}');
    `;

    const updateBookQuery = `
      UPDATE \`books\`
      SET \`quantity\` = '${newQuantity}'
      WHERE \`id\` = '${book_id}';
    `;

    await this.prismaService.$transaction([
      this.prismaService.$queryRawUnsafe(borrowInsertQuery),
      this.prismaService.$queryRawUnsafe(updateBookQuery),
    ]);
  }

  async find(type?: string) {
    const statusFilter = type ? `WHERE \`status\` = '${type}'` : '';
    const query = `
      SELECT b.\`borrow_date\`, b.\`due_date\`, b.\`status\`,
             u.\`username\`, bk.\`title\`
      FROM \`borrowings\` b
      JOIN \`users\` u ON b.\`user_id\` = u.\`id\`
      JOIN \`books\` bk ON b.\`book_id\` = bk.\`id\`
      ${statusFilter};
    `;
    return await this.prismaService.$queryRawUnsafe(query);
  }

  async findById(id: string) {
    const query = `SELECT * FROM \`borrowings\` WHERE \`id\` = '${id}';`;
    const borrow = await this.prismaService.$queryRawUnsafe(query);

    if (!borrow) throw new NotFoundException('Borrow with this id not exist');
    return borrow[0];
  }

  async findUser(id: string) {
    const query = `
      SELECT b.\`id\`, b.\`borrow_date\`, b.\`due_date\`, b.\`status\`,
             bk.\`title\`, bk.\`cover_image\`
      FROM \`borrowings\` b
      JOIN \`books\` bk ON b.\`book_id\` = bk.\`id\`
      WHERE b.\`user_id\` = '${id}';
    `;
    return await this.prismaService.$queryRawUnsafe(query);
  }

  async returnBook(id: string) {
    const borrowQuery = `
      SELECT b.*, bk.\`quantity\`
      FROM \`borrowings\` b
      JOIN \`books\` bk ON b.\`book_id\` = bk.\`id\`
      WHERE b.\`id\` = '${id}';
    `;
    const borrow = await this.prismaService.$queryRawUnsafe(borrowQuery);

    if (!borrow) throw new NotFoundException('Borrow not found');
    if (borrow[0].status === 'RETURNED')
      throw new BadRequestException('Book already returned');

    const newQuantity = borrow[0].quantity + 1;

    const returnQuery = `
      UPDATE \`borrowings\`
      SET \`status\` = 'RETURNED'
      WHERE \`id\` = '${id}';
    `;

    const updateBookQuery = `
      UPDATE \`books\`
      SET \`quantity\` = '${newQuantity}'
      WHERE \`id\` = '${borrow[0].book_id}';
    `;

    await this.prismaService.$transaction([
      this.prismaService.$queryRawUnsafe(returnQuery),
      this.prismaService.$queryRawUnsafe(updateBookQuery),
    ]);
  }
}
