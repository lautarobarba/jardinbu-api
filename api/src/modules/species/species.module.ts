import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { Species } from './species.entity';
import { GenusModule } from '../genus/genus.module';

@Module({
	imports: [TypeOrmModule.forFeature([Species]), GenusModule],
	controllers: [SpeciesController],
	providers: [SpeciesService],
})
export class SpeciesModule {}
