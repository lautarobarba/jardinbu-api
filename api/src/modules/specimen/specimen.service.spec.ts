import { Test, TestingModule } from '@nestjs/testing';
import { SpecimenService } from './specimen.service';

describe('SpecimenService', () => {
  let service: SpecimenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecimenService],
    }).compile();

    service = module.get<SpecimenService>(SpecimenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
