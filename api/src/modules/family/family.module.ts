import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { Family } from './family.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Family])],
	controllers: [FamilyController],
	providers: [FamilyService],
	exports: [FamilyService],
})
export class FamilyModule {}
