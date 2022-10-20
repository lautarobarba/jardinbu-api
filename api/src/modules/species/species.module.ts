import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { Species } from './species.entity';
import { GenreModule } from '../genre/genre.module';

@Module({
	imports: [TypeOrmModule.forFeature([Species]), GenreModule],
	controllers: [SpeciesController],
	providers: [SpeciesService],
})
export class SpeciesModule {}
