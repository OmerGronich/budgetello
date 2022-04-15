import { Injectable } from '@nestjs/common';
import { ServerSettingService } from './server-setting/server-setting.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

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

  async getData() {
    return { message: 'Welcome to stocks-api!' };
  }

  searchSymbols({ query: keywords }: { query: string }) {
    return firstValueFrom(
      this.httpService.get(`${this.url}/query`, {
        params: {
          function: 'SYMBOL_SEARCH',
          apikey: this.apiKey,
          keywords,
        },
      })
    );
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
