import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ServerSettingService } from './server-setting/server-setting.service';
import firebase from 'firebase-admin';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private serverSettings: ServerSettingService) {}

  firebaseApp = firebase.initializeApp(
    this.serverSettings.environment.firebase
  );

  use(req: any, res: any, next: () => void) {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      throw new BadRequestException('No token');
    }
    const token = bearerToken.replace('Bearer ', '');
    this.firebaseApp
      .auth()
      .verifyIdToken(token)
      .then(() => {
        return next();
      })
      .catch((err) => {
        console.log({ err });
        throw new UnauthorizedException('Invalid token');
      });
    //
    // try {
    //   console.log({ bearerToken });
    //   const token = bearerToken.replace('Bearer ', '');
    //   const fbKey = this.serverSettings.environment.fbKey;
    //   const verified = jwt.verify(token, fbKey, { algorithms: ['RS256'] });
    //   console.log({ verified });
    // } catch (err) {
    //   console.log({ err });
    //   throw new UnauthorizedException('Invalid token');
    // }
  }
}
