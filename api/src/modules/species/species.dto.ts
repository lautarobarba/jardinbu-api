import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Genus } from 'modules/genus/genus.entity';

export class CreateSpeciesDto {
	@ApiProperty()
	name: string;

	@ApiProperty()
	family: string;

	@ApiProperty()
	genusId: number;

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
	genre: Genus;

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
	genusId?: number;

	@ApiPropertyOptional()
	description?: string;

	@ApiPropertyOptional()
	distribution?: string;
}
