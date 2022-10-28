import {
	ConflictException,
	Injectable,
	NotAcceptableException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { validate } from 'class-validator';
import { Genus } from './genus.entity';
import { CreateGenusDto, UpdateGenusDto } from './genus.dto';

@Injectable()
export class GenusService {
	constructor(
		@InjectRepository(Genus)
		private readonly _genusRepository: Repository<Genus>
	) {}

	async create(createGenusDto: CreateGenusDto): Promise<Genus> {
		const { name } = createGenusDto;
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
			exists.deleted = false;
			exists.updatedAt = timestamp;

			// Controlo que el modelo no tenga errores antes de guardar
			const errors = await validate(exists);
			if (errors && errors.length > 0) throw new NotAcceptableException();

			return this._genusRepository.save(exists);
		}

		// Si no existe entonces creo uno nuevo
		const genus: Genus = await this._genusRepository.create();
		genus.name = name;
		genus.updatedAt = timestamp;
		genus.createdAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(genus);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._genusRepository.save(genus);
	}

	async findAll(): Promise<Genus[]> {
		return this._genusRepository.find({
			where: { deleted: false },
			order: { id: 'ASC' },
		});
	}

	async findOne(id: number): Promise<Genus> {
		const genus: Genus = await this._genusRepository.findOne({
			where: { id },
		});

		if (!genus) throw new NotFoundException();
		return genus;
	}

	async update(updateGenusDto: UpdateGenusDto): Promise<Genus> {
		const { id, name } = updateGenusDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const genus: Genus = await this._genusRepository.findOne({
			where: { id },
		});

		if (!genus) throw new NotFoundException();

		if (name) {
			// Controlo que las claves no esten en uso
			const exists: Genus = await this._genusRepository.findOne({
				where: { name },
			});

			// Si existe y no esta borrado lógico entonces hay conflictos
			if (exists && !exists.deleted && exists.id !== id)
				throw new ConflictException('Error: Keys already in use');
		}

		// Si no hay problemas actualizo los atributos
		if (name) genus.name = name;
		genus.updatedAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(genus);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._genusRepository.save(genus);
	}

	async delete(id: number) {
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
