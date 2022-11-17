import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Logger,
	UseGuards,
	ClassSerializerInterceptor,
	UseInterceptors,
	HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsEmailConfirmedGuard } from 'modules/auth/guards/is-email-confirmed.guard';
import { RoleGuard } from 'modules/auth/guards/role.guard';
import { Role } from 'modules/auth/role.enum';
import { CreateSpecimenDto, UpdateSpecimenDto } from './specimen.dto';
import { Specimen } from './specimen.entity';
import { SpecimenService } from './specimen.service';

@ApiTags('Ejemplares')
@Controller('specimen')
export class SpecimenController {
	constructor(private readonly _specimenService: SpecimenService) { }
	private readonly _logger = new Logger(SpecimenController.name);

	@Post()
	@UseGuards(RoleGuard([Role.ADMIN]))
	@UseGuards(IsEmailConfirmedGuard())
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiBearerAuth()
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: Specimen,
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
	async create(@Body() createSpecimenDto: CreateSpecimenDto): Promise<Specimen> {
		this._logger.debug('POST: /api/specimen');
		return this._specimenService.create(CreateSpecimenDto);
	}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		type: Specimen,
		isArray: true,
	})
	async findAll(): Promise<Specimen[]> {
		this._logger.debug('GET: /api/specimen');
		return this._specimenService.findAll();
	}

	@Patch()
	@UseGuards(RoleGuard([Role.ADMIN]))
	@UseGuards(IsEmailConfirmedGuard())
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiBearerAuth()
	@ApiResponse({
		status: HttpStatus.OK,
		type: Specimen,
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
	update(@Body() updateSpecimenDto: UpdateSpecimenDto) {
		this._logger.debug('PATCH: /api/specimen');
		return this._specimenService.update(updateSpecimenDto);
	}

	@Get(':id')
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		type: Specimen,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	async findOne(@Param('id') id: number): Promise<Specimen> {
		this._logger.debug('GET: /api/specimen/:id');
		return this._specimenService.findOne(id);
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
		this._logger.debug('DELETE: /api/specimen/:id');
		return this._specimenService.delete(id);
	}
}
