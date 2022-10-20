import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSpeciesDto {
	@ApiProperty()
	name: string;

	@ApiProperty()
	family: string;

	@ApiProperty()
	genre: number;

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
	genre: number;

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

	@ApiProperty()
	name: string;

	@ApiProperty()
	family: string;

	@ApiProperty()
	genre: number;

	@ApiProperty()
	description: string;

	@ApiProperty()
	distribution: string;
}
