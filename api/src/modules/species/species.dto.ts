import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenreDto } from 'modules/genre/genre.dto';

export class CreateSpeciesDto {
	@ApiProperty()
	name: string;

	@ApiProperty()
	family: string;

	@ApiProperty()
	genreId: number;

	@ApiProperty()
	description: string;

	@ApiProperty()
	distribution: string;
}

export class SpeciesDto {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	family: string;

	@ApiProperty()
	genre: GenreDto;

	@ApiProperty()
	description: string;

	@ApiProperty()
	distribution: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;

	@ApiProperty()
	deleted: boolean;
}

export class UpdateSpeciesDto {
	@ApiProperty()
	id: number;

	@ApiPropertyOptional()
	name?: string;

	@ApiPropertyOptional()
	family?: string;

	@ApiPropertyOptional()
	genreId?: number;

	@ApiPropertyOptional()
	description?: string;

	@ApiPropertyOptional()
	distribution?: string;
}
