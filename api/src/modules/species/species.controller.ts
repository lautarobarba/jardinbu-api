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
import { IsEmailConfirmedGuard } from 'modules/auth/guards/is-email-confirmed.guard';
import { RoleGuard } from 'modules/auth/guards/role.guard';
import { Role } from 'modules/auth/role.enum';
import { CreateSpeciesDto, UpdateSpeciesDto } from './species.dto';
import { Species } from './species.entity';
import { SpeciesService } from './species.service';

@ApiTags('Especies')
@Controller('species')
export class SpeciesController {
	constructor(private readonly _speciesService: SpeciesService) { }
	private readonly _logger = new Logger(SpeciesController.name);

	@Post()
	@UseGuards(RoleGuard([Role.ADMIN]))
	@UseGuards(IsEmailConfirmedGuard())
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiBearerAuth()
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: Species,
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
	async create(@Body() createSpeciesDto: CreateSpeciesDto): Promise<Species> {
		this._logger.debug('POST: /api/species');
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
		this._logger.debug('GET: /api/species');
		return this._speciesService.findAll();
	}

	@Patch()
	@UseGuards(RoleGuard([Role.ADMIN]))
	@UseGuards(IsEmailConfirmedGuard())
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiBearerAuth()
	@ApiResponse({
		status: HttpStatus.OK,
		type: Species,
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
	update(@Body() updateSpeciesDto: UpdateSpeciesDto) {
		this._logger.debug('PATCH: /api/species');
		return this._speciesService.update(updateSpeciesDto);
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
		this._logger.debug('GET: /api/species/:id');
		return this._speciesService.findOne(id);
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
		this._logger.debug('DELETE: /api/species/:id');
		return this._speciesService.delete(id);
	}
}
