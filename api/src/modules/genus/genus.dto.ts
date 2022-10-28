import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGenusDto {
	@ApiProperty()
	name: string;

	// TODO falta familia y descripcion
}

export class UpdateGenusDto {
	@ApiProperty()
	id: number;

	@ApiPropertyOptional()
	name?: string;

	// TODO falta familia y descripcion
}
