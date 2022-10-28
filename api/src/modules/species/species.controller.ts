import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	ClassSerializerInterceptor,
	HttpStatus,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSpeciesDto, UpdateSpeciesDto } from './species.dto';
import { Species } from './species.entity';
import { SpeciesService } from './species.service';

@ApiTags('Especies')
@Controller('species')
export class SpeciesController {
	constructor(private readonly _speciesService: SpeciesService) {}

	@Post()
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: Species,
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'Error: Keys already in use',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	@ApiResponse({
		status: HttpStatus.NOT_ACCEPTABLE,
		description: 'Error: Not Acceptable',
	})
	async create(@Body() createSpeciesDto: CreateSpeciesDto): Promise<Species> {
		return this._speciesService.create(createSpeciesDto);
	}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		type: Species,
		isArray: true,
	})
	async findAll(): Promise<Species[]> {
		return this._speciesService.findAll();
	}

	@Get(':id')
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		type: Species,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	async findOne(@Param('id') id: number): Promise<Species> {
		return this._speciesService.findOne(id);
	}

	@Patch(':id')
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		type: Species,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'Error: Keys already in use',
	})
	update(@Body() updateSpeciesDto: UpdateSpeciesDto) {
		return this._speciesService.update(updateSpeciesDto);
	}

	@Delete(':id')
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	async delete(@Param('id') id: number) {
		return this._speciesService.delete(id);
	}
}
