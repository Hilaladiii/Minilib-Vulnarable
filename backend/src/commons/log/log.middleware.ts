import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonService } from 'src/modules/winston/winston.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: WinstonService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, headers, query, body } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      this.loggerService.logRequest({
        method,
        url,
        headers: {
          host: headers.host,
          userAgent: headers['user-agent'],
        },
        query,
        body,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
      });
    });

    next();
  }
}
