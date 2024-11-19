import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { verify } from 'argon2';
import { Request } from 'express';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class TokenGuard extends AuthGuard('jwt') {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) return false;

    try {
      const tokenReq = this.jwtService.verify(
        token,
        this.configService.get('JWT_SECRET'),
      );
      const user = await this.prismaService.user.findUnique({
        where: { id: tokenReq.sub },
        select: { token: true },
      });

      const isValidToken = await verify(user.token, token);

      if (!isValidToken) return false;

      if (!tokenReq) return false;

      request.user = tokenReq;

      return true;
    } catch (error) {
      return false;
    }
  }
}
