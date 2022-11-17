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
	Logger,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenusService } from './genus.service';
import { CreateGenusDto, UpdateGenusDto } from './genus.dto';
import { Genus } from './genus.entity';
import { RoleGuard } from 'modules/auth/guards/role.guard';
import { Role } from 'modules/auth/role.enum';
import { IsEmailConfirmedGuard } from 'modules/auth/guards/is-email-confirmed.guard';

@ApiTags('Géneros')
@Controller('genus')
export class GenusController {
	constructor(private readonly _genusService: GenusService) { }
	private readonly _logger = new Logger(GenusController.name);

	@Post()
	@UseGuards(RoleGuard([Role.ADMIN]))
	@UseGuards(IsEmailConfirmedGuard())
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiBearerAuth()
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: Genus,
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: 'Error: Unauthorized',
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
		this._logger.debug('POST: /api/genus');
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
		this._logger.debug('GET: /api/genus');
		return this._genusService.findAll();
	}

	@Patch()
	@UseGuards(RoleGuard([Role.ADMIN]))
	@UseGuards(IsEmailConfirmedGuard())
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiBearerAuth()
	@ApiResponse({
		status: HttpStatus.OK,
		type: Genus,
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: 'Error: Unauthorized',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'Error: Keys already in use',
	})
	@ApiResponse({
		status: HttpStatus.NOT_ACCEPTABLE,
		description: 'Error: Not Acceptable',
	})
	async update(@Body() updateGenusDto: UpdateGenusDto): Promise<Genus> {
		this._logger.debug('PATCH: /api/genus');
		return this._genusService.update(updateGenusDto);
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
		this._logger.debug('GET: /api/genus/:id');
		return this._genusService.findOne(id);
	}

	@Delete(':id')
	@UseGuards(RoleGuard([Role.ADMIN]))
	@UseGuards(IsEmailConfirmedGuard())
	@ApiBearerAuth()
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: 'Error: Unauthorized',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	async delete(@Param('id') id: number) {
		this._logger.debug('DELETE: /api/genus/:id');
		return this._genusService.delete(id);
	}
}
