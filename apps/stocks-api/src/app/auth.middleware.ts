import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import firebase from 'firebase-admin';
import { environment } from '../environments/environment';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  firebaseApp = firebase.initializeApp(environment.firebase);

  use(req: any, res: any, next: () => void) {
    if (!environment.production) {
      return next();
    }

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
  }
}
