import { Injectable } from '@nestjs/common';
import { environment as devEnvironment } from '../../environments/environment';
import { environment as prodEnvironment } from '../../environments/environment.prod';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServerSettingService {
  get environment(): any {
    if (process.env.NODE_ENV === 'production') {
      return prodEnvironment;
    } else {
      return devEnvironment;
    }
  }

  constructor(private config: ConfigService) {}
}
