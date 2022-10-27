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
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';

@ApiTags('Familia')
@Controller('family')
export class FamilyController {
	constructor(private readonly familyService: FamilyService) {}

	@Post()
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: FamilyDto,
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'Error: Keys already in use',
	})
	@ApiResponse({
		status: HttpStatus.NOT_ACCEPTABLE,
		description: 'Error: Not Acceptable',
	})
	create(@Body() createFamilyDto: CreateFamilyDto) {
		return this.familyService.create(createFamilyDto);
	}

	@Get()
	findAll() {
		return this.familyService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.familyService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateFamilyDto: UpdateFamilyDto) {
		return this.familyService.update(+id, updateFamilyDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.familyService.remove(+id);
	}
}
