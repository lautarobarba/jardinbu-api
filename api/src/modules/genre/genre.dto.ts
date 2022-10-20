import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGenreDto {
	@ApiProperty()
	name: string;
}

export class GenreDto {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;

	@ApiProperty()
	deleted: boolean;
}

export class UpdateGenreDto {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;
}
