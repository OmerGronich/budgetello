import { Test, TestingModule } from '@nestjs/testing';
import { ServerSettingService } from './server-setting.service';

describe('ServerSettingService', () => {
  let service: ServerSettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerSettingService],
    }).compile();

    service = module.get<ServerSettingService>(ServerSettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
