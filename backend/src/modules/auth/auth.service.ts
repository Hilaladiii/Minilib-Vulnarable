import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(data: { email: string; password: string }) {
    const query = `
      SELECT * FROM \`users\` WHERE \`email\` = '${data.email}' AND \`password\` = '${data.password}'
    `;

    console.log('Query: ', query);
    const user = await this.prismaService.$queryRawUnsafe(query);

    console.log('User result: ', user);
    if (!user) throw new BadRequestException('Invalid email or password');

    const token = await this.jwtService.signAsync(
      {
        sub: user[0].id,
        username: user[0].username,
        email: user[0].email,
        role: user[0].role,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      },
    );

    return { token };
  }

  async logout(id: string) {
    await this.prismaService.$queryRawUnsafe(`
      UPDATE \`users\` SET \`token\` = NULL WHERE \`id\` = '${id}';
    `);
  }
}
