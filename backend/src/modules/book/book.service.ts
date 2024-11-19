import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class BookService {
  constructor(
    private prismaService: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async create(
    file: Express.Multer.File,
    data: {
      title: string;
      author_name: string;
      publisher_name: string;
      year_published: number;
      quantity: number;
    },
  ) {
    const cover_uri = await this.supabaseService.upload(file);
    const { title, author_name, publisher_name, year_published, quantity } =
      data;

    const query = `
        INSERT INTO \`books\` (\`title\`, \`author_name\`, \`publisher_name\`, \`year_published\`, \`quantity\`, \`cover_image\`)
        VALUES ('${title}', '${author_name}', '${publisher_name}', '${year_published}', '${quantity}', '${cover_uri.publicUrl}');
      `;

    return await this.prismaService.$queryRawUnsafe(query);
  }

  async find() {
    const query = `
        SELECT * FROM \`books\`;
      `;
    return await this.prismaService.$queryRawUnsafe(query);
  }

  async findById(id: string) {
    const query = `
        SELECT * FROM \`books\` WHERE \`id\` = '${id}';
      `;

    const book = await this.prismaService.$queryRawUnsafe(query);
    if (!book) throw new NotFoundException('Book not found');
    return book[0];
  }

  async delete(id: string) {
    const queryFind = `
        SELECT * FROM \`books\` WHERE \`id\` = '${id}';
      `;

    const book = await this.prismaService.$queryRawUnsafe(queryFind);
    if (!book) throw new BadRequestException('Book not found');

    const queryDelete = `
        DELETE FROM \`books\` WHERE \`id\` = '${id}';
      `;
    return await this.prismaService.$queryRawUnsafe(queryDelete);
  }

  async update(
    id: string,
    file: Express.Multer.File,
    data: {
      title: string;
      author_name: string;
      publisher_name: string;
      year_published: number;
      quantity: number;
    },
  ) {
    const queryFind = `
        SELECT * FROM \`books\` WHERE \`id\` = '${id}';
      `;

    const book = await this.prismaService.$queryRawUnsafe(queryFind);
    if (!book) throw new BadRequestException('Book not found');

    let cover_uri = book[0].cover_image;

    if (file) {
      await this.supabaseService.delete(book[0].cover_image);
      const { publicUrl } = await this.supabaseService.upload(file);
      cover_uri = publicUrl;
    }

    const { title, author_name, publisher_name, year_published, quantity } =
      data;

    const queryUpdate = `
        UPDATE \`books\` 
        SET 
          \`title\` = '${title || book[0].title}',
          \`author_name\` = '${author_name || book[0].author_name}',
          \`publisher_name\` = '${publisher_name || book[0].publisher_name}',
          \`year_published\` = '${year_published || book[0].year_published}',
          \`quantity\` = '${quantity || book[0].quantity}',
          \`cover_image\` = '${cover_uri}'
        WHERE \`id\` = '${id}';
      `;

    return await this.prismaService.$queryRawUnsafe(queryUpdate);
  }
}
