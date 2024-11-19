import { ConfigService } from '@nestjs/config';

export const jwtConstant = (config: ConfigService) => {
  return config.get('JWT_SECRET');
};

export const config = new ConfigService();
