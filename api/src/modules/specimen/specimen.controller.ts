import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { SpecimenService } from './specimen.service';
// import { CreateSpecimanDto } from './dto/create-speciman.dto';
// import { UpdateSpecimanDto } from './dto/update-speciman.dto';

@Controller('specimen')
export class SpecimenController {
	constructor(private readonly _specimenService: SpecimenService) {}

	// @Post()
	// async create(@Body() createSpecimanDto: CreateSpecimanDto) {
	//   return this._specimenService.create(createSpecimanDto);
	// }

	// @Get()
	// async findAll() {
	//   return this._specimenService.findAll();
	// }

	// @Get(':id')
	// async findOne(@Param('id') id: number) {
	//   return this._specimenService.findOne(+id);
	// }

	// @Patch()
	// async update(@Body() updateSpecimanDto: UpdateSpecimanDto) {
	//   return this._specimenService.update(+id, updateSpecimanDto);
	// }

	// @Delete(':id')
	// async delete(@Param('id') id: number) {
	//   return this._specimenService.delete(+id);
	// }
}
