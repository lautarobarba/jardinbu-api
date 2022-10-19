import { Injectable } from '@nestjs/common';
import { CreateSpecimanDto } from './dto/create-speciman.dto';
import { UpdateSpecimanDto } from './dto/update-speciman.dto';

@Injectable()
export class SpecimenService {
  create(createSpecimanDto: CreateSpecimanDto) {
    return 'This action adds a new speciman';
  }

  findAll() {
    return `This action returns all specimen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} speciman`;
  }

  update(id: number, updateSpecimanDto: UpdateSpecimanDto) {
    return `This action updates a #${id} speciman`;
  }

  remove(id: number) {
    return `This action removes a #${id} speciman`;
  }
}
