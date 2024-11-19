import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { BookModule } from './modules/book/book.module';
import { BorrowModule } from './modules/borrow/borrow.module';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    BookModule,
    BorrowModule,
    SupabaseModule,
    PrismaModule,
    CommentModule,
  ],
})
export class AppModule {}
