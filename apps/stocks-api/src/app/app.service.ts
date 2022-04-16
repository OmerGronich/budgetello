import { Injectable } from '@nestjs/common';
import { ServerSettingService } from './server-setting/server-setting.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import valvelet from 'valvelet';

@Injectable()
export class AppService {
  get url() {
    return this.serverSettings.environment.apiUrl;
  }

  get apiKey() {
    return this.serverSettings.environment.apiKey;
  }

  constructor(
    private serverSettings: ServerSettingService,
    private httpService: HttpService
  ) {}

  async searchSymbols({ query: keywords }: { query: string }) {
    const apikey = this.apiKey;
    const url = this.url;
    const get = valvelet(
      () => {
        return firstValueFrom(
          this.httpService.get(`${url}/query`, {
            params: {
              function: 'SYMBOL_SEARCH',
              apikey,
              keywords,
            },
          })
        );
      },
      5,
      60000
    );
    return get();
  }

  async searchStock({ symbol }: { symbol: string }) {
    return firstValueFrom(
      this.httpService.get(`${this.url}/query`, {
        params: {
          function: 'GLOBAL_QUOTE',
          apikey: this.apiKey,
          symbol,
        },
      })
    );
  }
}
