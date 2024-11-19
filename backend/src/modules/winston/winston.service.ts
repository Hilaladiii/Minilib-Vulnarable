import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class WinstonService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({
          filename: './public/logs/vulnerable-log.log',
        }),
        new winston.transports.Console(),
      ],
    });
  }

  logRequest(requestData: Record<string, any>) {
    this.logger.info(requestData);
  }
}
