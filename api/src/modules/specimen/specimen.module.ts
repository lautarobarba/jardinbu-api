import { Module } from '@nestjs/common';
import { SpecimenService } from './specimen.service';
import { SpecimenController } from './specimen.controller';

@Module({
  controllers: [SpecimenController],
  providers: [SpecimenService]
})
export class SpecimenModule {}
