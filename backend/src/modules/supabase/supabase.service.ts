import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabaseClient: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabaseClient = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_KEY'),
    );
  }

  async upload(file: Express.Multer.File, bucket: string = 'images') {
    try {
      const { error } = await this.supabaseClient.storage
        .from(bucket)
        .upload(file.originalname, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) throw new InternalServerErrorException();
      const { data } = this.supabaseClient.storage
        .from(bucket)
        .getPublicUrl(file.originalname);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(fileUrl: string, bucket: string = 'images') {
    try {
      const pathPattern = /storage\/v1\/object\/public\/(.*)/;
      const match = fileUrl.match(pathPattern);
      if (!match) {
        throw new BadRequestException('Invalid file URL');
      }
      const filePath = match[1];

      const { error } = await this.supabaseClient.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw new InternalServerErrorException();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
