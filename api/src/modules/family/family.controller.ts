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
import { CreateFamilyDto, UpdateFamilyDto } from './family.dto';
import { Family } from './family.entity';
import { FamilyService } from './family.service';

@ApiTags('Familia')
@Controller('family')
export class FamilyController {
	constructor(private readonly _familyService: FamilyService) { }
	private readonly _logger = new Logger(FamilyController.name);

	@Post()
	@UseGuards(RoleGuard([Role.ADMIN]))
	@UseGuards(IsEmailConfirmedGuard())
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiBearerAuth()
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: Family,
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
	async create(@Body() createFamilyDto: CreateFamilyDto): Promise<Family> {
		this._logger.debug('POST: /api/family');
		return this._familyService.create(createFamilyDto);
	}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		type: Family,
		isArray: true,
	})
	async findAll(): Promise<Family[]> {
		this._logger.debug('GET: /api/family');
		return this._familyService.findAll();
	}

	@Patch()
	@UseGuards(RoleGuard([Role.ADMIN]))
	@UseGuards(IsEmailConfirmedGuard())
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiBearerAuth()
	@ApiResponse({
		status: HttpStatus.OK,
		type: Family,
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
	async update(@Body() updateFamilyDto: UpdateFamilyDto): Promise<Family> {
		this._logger.debug('PATCH: /api/family');
		return this._familyService.update(updateFamilyDto);
	}

	@Get(':id')
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		type: Family,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	async findOne(@Param('id') id: number): Promise<Family> {
		this._logger.debug('GET: /api/family/:id');
		return this._familyService.findOne(id);
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
		this._logger.debug('DELETE: /api/family/:id');
		return this._familyService.delete(id);
	}
}
