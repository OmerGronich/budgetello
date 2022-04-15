import { Controller, Get, Query } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/search-symbols')
  async searchSymbols(@Query('q') query: string) {
    const { data } = await this.appService.searchSymbols({ query });
    return data;
  }

  @Get('/search-stock')
  async searchStock(@Query('symbol') symbol: string) {
    const { data } = await this.appService.searchStock({ symbol });
    return data;
  }
}
