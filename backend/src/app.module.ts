import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { BookModule } from './modules/book/book.module';
import { BorrowModule } from './modules/borrow/borrow.module';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CommentModule } from './modules/comment/comment.module';
import { WinstonAppModule } from './modules/winston/winston.module';
import { LoggerMiddleware } from './commons/log/log.middleware';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      format: winston.format.json(),
      level: 'debug',
      transports: [new winston.transports.Console()],
    }),
    AuthModule,
    UserModule,
    BookModule,
    BorrowModule,
    SupabaseModule,
    PrismaModule,
    CommentModule,
    WinstonAppModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
