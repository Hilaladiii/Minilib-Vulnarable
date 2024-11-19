import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'argon2';
import { argonOption } from 'src/commons/config/argon';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async register(data: { email: string; username: string; password: string }) {
    const user = await this.prismaService.$queryRawUnsafe(`
        SELECT * FROM \`users\` WHERE \`email\` = '${data.email}' LIMIT 1;
      `);

    if (!user)
      throw new BadRequestException('User with this email already exists');

    return await this.prismaService.$queryRawUnsafe(`
        INSERT INTO \`users\` (\`email\`, \`username\`, \`password\`) 
        VALUES ('${data.email}', '${data.username}', '${data.password}');
      `);
  }

  async find() {
    return await this.prismaService.$queryRawUnsafe(`
        SELECT \`id\`, \`email\`, \`username\`, \`isBlocked\`, \`createdAt\` 
        FROM \`users\` 
        WHERE \`role\` != 'ADMIN';
      `);
  }

  async findByid(id: string) {
    const user = await this.prismaService.$queryRawUnsafe(`
        SELECT \`id\`, \`email\`, \`username\` FROM \`users\` WHERE \`id\` = '${id}' LIMIT 1;
      `);

    if (!user) throw new NotFoundException('User not found');

    return user[0];
  }

  async block(id: string) {
    const user = await this.prismaService.$queryRawUnsafe(`
        SELECT * FROM \`users\` WHERE \`id\` = '${id}' LIMIT 1;
      `);

    if (!user) throw new NotFoundException('User not found');

    return await this.prismaService.$queryRawUnsafe(`
        UPDATE \`users\` 
        SET \`isBlocked\` = TRUE 
        WHERE \`id\` = '${id}';
      `);
  }

  async unBlock(id: string) {
    const user = await this.prismaService.$queryRawUnsafe(`
        SELECT * FROM \`users\` WHERE \`id\` = '${id}' LIMIT 1;
      `);

    if (!user) throw new NotFoundException('User not found');

    return await this.prismaService.$queryRawUnsafe(`
        UPDATE \`users\` 
        SET \`isBlocked\` = FALSE 
        WHERE \`id\` = '${id}';
      `);
  }
}
