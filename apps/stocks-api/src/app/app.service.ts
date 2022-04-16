import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import valvelet from 'valvelet';
import { environment } from '../environments/environment';

@Injectable()
export class AppService {
  get url() {
    return environment.apiUrl;
  }

  get apiKey() {
    return environment.apiKey;
  }

  constructor(private httpService: HttpService) {}

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
    const get = valvelet(
      () => {
        return firstValueFrom(
          this.httpService.get(`${this.url}/query`, {
            params: {
              function: 'GLOBAL_QUOTE',
              apikey: this.apiKey,
              symbol,
            },
          })
        );
      },
      5,
      60000
    );
    return get();
  }
}
