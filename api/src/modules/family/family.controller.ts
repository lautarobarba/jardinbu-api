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
import { CreateFamilyDto, UpdateFamilyDto } from './family.dto';
import { Family } from './family.entity';
import { FamilyService } from './family.service';

@ApiTags('Familia')
@Controller('family')
export class FamilyController {
	constructor(private readonly familyService: FamilyService) {}

	@Post()
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: Family,
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
		return this.familyService.create(createFamilyDto);
	}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		type: Family,
		isArray: true,
	})
	async findAll(): Promise<Family[]> {
		return this.familyService.findAll();
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
		return this.familyService.findOne(id);
	}

	@Patch()
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.OK,
		type: Family,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'Error: Keys already in use',
	})
	async update(@Body() updateFamilyDto: UpdateFamilyDto): Promise<Family> {
		return this.familyService.update(updateFamilyDto);
	}

	@Delete(':id')
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Error: Not Found',
	})
	remove(@Param('id') id: number) {
		return this.familyService.delete(id);
	}
}
