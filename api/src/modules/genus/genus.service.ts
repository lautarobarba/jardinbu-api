import {
	ConflictException,
	Injectable,
	Logger,
	NotAcceptableException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { validate } from 'class-validator';
import { FamilyService } from '../family/family.service';
import { Genus } from './genus.entity';
import { CreateGenusDto, UpdateGenusDto } from './genus.dto';

@Injectable()
export class GenusService {
	constructor(
		@InjectRepository(Genus)
		private readonly _genusRepository: Repository<Genus>,
		private readonly _familyService: FamilyService
	) { }
	private readonly _logger = new Logger(GenusService.name);

	async create(createGenusDto: CreateGenusDto): Promise<Genus> {
		this._logger.debug('create()');
		const { name, description, familyId } = createGenusDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		// Controlo que el nuevo genero no exista
		const exists: Genus = await this._genusRepository.findOne({
			where: { name },
		});

		// Si existe y no esta borrado lógico entonces hay conflictos
		if (exists && !exists.deleted)
			throw new ConflictException('Error: Keys already in use');

		// Si existe pero estaba borrado lógico entonces lo recupero
		if (exists && exists.deleted) {
			exists.description = description;
			exists.family = await this._familyService.findOne(familyId);
			exists.updatedAt = timestamp;
			exists.deleted = false;

			// Controlo que el modelo no tenga errores antes de guardar
			const errors = await validate(exists);
			if (errors && errors.length > 0) throw new NotAcceptableException();

			return this._genusRepository.save(exists);
		}

		// Si no existe entonces creo uno nuevo
		const genus: Genus = this._genusRepository.create();
		genus.name = name;
		genus.description = description;
		genus.family = await this._familyService.findOne(familyId);
		genus.createdAt = timestamp;
		genus.updatedAt = timestamp;
		genus.deleted = false;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(genus);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._genusRepository.save(genus);
	}

	async findAll(): Promise<Genus[]> {
		this._logger.debug('findAll()');
		return this._genusRepository.find({
			where: { deleted: false },
			order: { id: 'ASC' },
			relations: ['family'],
		});
	}

	async findOne(id: number): Promise<Genus> {
		this._logger.debug('findOne()');
		const genus: Genus = await this._genusRepository.findOne({
			where: { id },
			relations: ['family'],
		});

		if (!genus) throw new NotFoundException();
		return genus;
	}

	async update(updateGenusDto: UpdateGenusDto): Promise<Genus> {
		this._logger.debug('update()');
		const { id, name, description, familyId } = updateGenusDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const genus: Genus = await this._genusRepository.findOne({
			where: { id },
		});

		if (!genus) throw new NotFoundException();

		if (name) {
			// Controlo que las claves no estén en uso
			const exists: Genus = await this._genusRepository.findOne({
				where: { name },
			});

			// Si existe y no esta borrado lógico entonces hay conflictos
			if (exists && !exists.deleted && exists.id !== id)
				throw new ConflictException('Error: Keys already in use');
		}

		// Si no hay problemas actualizo los atributos
		if (name) genus.name = name;
		if (description) genus.description = description;
		if (familyId) genus.family = await this._familyService.findOne(familyId);
		genus.updatedAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(genus);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._genusRepository.save(genus);
	}

	async delete(id: number) {
		this._logger.debug('delete()');
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const genus: Genus = await this._genusRepository.findOne({
			where: { id },
		});

		if (!genus) throw new NotFoundException();

		genus.deleted = true;
		genus.updatedAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(genus);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		this._genusRepository.save(genus);
	}
}
