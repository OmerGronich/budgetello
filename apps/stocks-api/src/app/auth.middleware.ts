import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ServerSettingService } from './server-setting/server-setting.service';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private serverSettings: ServerSettingService) {}

  use(req: any, res: any, next: () => void) {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      throw new BadRequestException('No token');
    }

    const token = bearerToken.replace('Bearer ', '');
    const fbKey = this.serverSettings.environment.fbKey;
    jwt.verify(token, fbKey, function (err, decoded) {
      if (err) {
        throw new UnauthorizedException('Unauthorized');
      }

      next();
    });
  }
}
