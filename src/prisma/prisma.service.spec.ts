import { Test, TestingModule } from '@nestjs/testing';
import { PrimsaService } from './prisma.service';

describe('PrimsaService', () => {
  let prisma: PrimsaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrimsaService],
    }).compile();

    prisma = module.get<PrimsaService>(PrimsaService);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
  });
});
