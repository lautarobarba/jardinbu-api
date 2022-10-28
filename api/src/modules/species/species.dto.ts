import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Genus } from '../genus/genus.entity';

export class CreateSpeciesDto {
	@ApiProperty()
	name: string;

	@ApiPropertyOptional()
	description?: string;

	@ApiPropertyOptional()
	genusId: number;

	@ApiPropertyOptional()
	distribution?: string;

	// @ApiPropertyOptional()
	// example_img?: string;

	// @ApiPropertyOptional()
	// foliage_img?: string;
}

export class UpdateSpeciesDto {
	@ApiProperty()
	id: number;

	@ApiPropertyOptional()
	name?: string;

	@ApiPropertyOptional()
	description?: string;

	@ApiPropertyOptional()
	genusId?: number;

	@ApiPropertyOptional()
	distribution?: string;

	// @ApiPropertyOptional()
	// example_img?: string;

	// @ApiPropertyOptional()
	// foliage_img?: string;
}
