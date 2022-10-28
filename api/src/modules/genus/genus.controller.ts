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
import { GenusService } from './genus.service';
import { CreateGenusDto, UpdateGenusDto } from './genus.dto';
import { Genus } from './genus.entity';

@ApiTags('Géneros')
@Controller('Genus')
export class GenusController {
	constructor(private readonly _genusService: GenusService) {}

	@Post()
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: Genus,
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'Error: Keys already in use',
	})
	@ApiResponse({
		status: HttpStatus.NOT_ACCEPTABLE,
		description: 'Error: Not Acceptable',
	})
	async create(@Body() createGenusDto: CreateGenusDto): Promise<Genus> {
		return this._genusService.create(createGenusDto);
	}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		type: Genus,
		isArray: true,
	})
	async findAll(): Promise<Genus[]> {
		return this._genusService.findAll();
	}

	@Get(':id')
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		type: Genus,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	async findOne(@Param('id') id: number): Promise<Genus> {
		return this._genusService.findOne(id);
	}

	@Patch()
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		type: Genus,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'Error: Keys already in use',
	})
	async update(@Body() updateGenusDto: UpdateGenusDto): Promise<Genus> {
		return this._genusService.update(updateGenusDto);
	}

	@Delete(':id')
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	async delete(@Param('id') id: number) {
		return this._genusService.delete(id);
	}
}
