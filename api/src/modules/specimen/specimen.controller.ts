import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpecimenService } from './specimen.service';
import { CreateSpecimanDto } from './dto/create-speciman.dto';
import { UpdateSpecimanDto } from './dto/update-speciman.dto';

@Controller('specimen')
export class SpecimenController {
  constructor(private readonly specimenService: SpecimenService) {}

  @Post()
  create(@Body() createSpecimanDto: CreateSpecimanDto) {
    return this.specimenService.create(createSpecimanDto);
  }

  @Get()
  findAll() {
    return this.specimenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specimenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecimanDto: UpdateSpecimanDto) {
    return this.specimenService.update(+id, updateSpecimanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specimenService.remove(+id);
  }
}
