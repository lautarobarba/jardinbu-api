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
import { GenreService } from './genre.service';
import { CreateGenreDto, GenreDto, UpdateGenreDto } from './genre.dto';
import { Genre } from './genre.entity';
// import { UpdateGenreDto } from './dto/update-genre.dto';

@ApiTags('Géneros')
@Controller('genre')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Post()
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.CREATED,
		// description: 'Genre created',
		type: GenreDto,
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'Error: Attributes already in use',
	})
	async create(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
		return this.genreService.create(createGenreDto);
	}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		// description: 'Genre list',
		type: GenreDto,
		isArray: true,
	})
	async findAll(): Promise<Genre[]> {
		return this.genreService.findAll();
	}

	@Get(':id')
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		// description: 'Genre list',
		type: GenreDto,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	async findOne(@Param('id') id: number): Promise<Genre> {
		return this.genreService.findOne(id);
	}

	@Patch(':id')
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		// description: 'Genre list',
		type: GenreDto,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'Error: Attributes already in use',
	})
	async update(@Body() updateGenreDto: UpdateGenreDto): Promise<Genre> {
		return this.genreService.update(updateGenreDto);
	}

	@Delete(':id')
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	async delete(@Param('id') id: number) {
		return this.genreService.delete(id);
	}
}
