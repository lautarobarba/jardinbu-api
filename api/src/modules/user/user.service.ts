import { ConflictException, Injectable, Logger, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { Status, User } from './user.entity';
import * as moment from 'moment';
import * as mv from 'mv';
import * as fs from 'fs';
import { validate } from 'class-validator';
import { Role } from '../auth/role.enum';
import { IJWTPayload } from 'modules/auth/jwt-payload.interface';
import { Picture } from 'modules/utils/picture.entity';
import { UtilsService } from 'modules/utils/utils.service';


@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly _userRepository: Repository<User>,
		private readonly _utilsService: UtilsService
	) { }
	private readonly _logger = new Logger(UserService.name);

	async create(createUserDto: CreateUserDto): Promise<User> {
		this._logger.debug('create()');
		const { email, firstname, lastname, password } = createUserDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		// Controlo que el nuevo usuario no exista
		const exists: User = await this._userRepository.findOne({
			where: { email },
		});

		// Si existe y no esta borrado lógico entonces hay conflictos
		if (exists && !exists.deleted) {
			this._logger.debug('Error: Email already in use');
			throw new ConflictException('Error: Email already in use');
		}

		// Si existe pero estaba borrado lógico entonces lo recupero
		if (exists && exists.deleted) {
			exists.firstname = firstname;
			exists.lastname = lastname;
			exists.password = password;
			exists.profilePicture = null;
			exists.deleted = false;
			exists.updatedAt = timestamp;

			// Controlo que el modelo no tenga errores antes de guardar
			const errors = await validate(exists);
			if (errors && errors.length > 0) {
				this._logger.debug('Error: Not Acceptable');
				throw new NotAcceptableException('Error: Not Acceptable');
			}

			return this._userRepository.save(exists);
		}

		// Si no existe entonces creo uno nuevo
		const user: User = this._userRepository.create();
		user.email = email;
		user.isEmailConfirmed = false;
		user.firstname = firstname;
		user.lastname = lastname;
		user.password = password;
		user.status = Status.ACTIVE;
		user.role = Role.ADMIN;
		user.updatedAt = timestamp;
		user.createdAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(user);
		if (errors && errors.length > 0) {
			this._logger.debug('Error: Not Acceptable');
			throw new NotAcceptableException('Error: Not Acceptable');
		}

		return this._userRepository.save(user);
	}

	async findAll(): Promise<User[]> {
		this._logger.debug('findAll()');
		return this._userRepository.find({
			where: { deleted: false },
			order: { id: 'ASC' },
		});
	}

	async findOne(id: number): Promise<User> {
		this._logger.debug('findOne()');
		return this._userRepository.findOne({
			where: { id },
			relations: ['profilePicture']
		});
	}

	async findOneById(id: number): Promise<User> {
		this._logger.debug('findOneById()');
		return this._userRepository.findOne({
			where: { id },
		});
	}

	async findOneByEmail(email: string): Promise<User> {
		this._logger.debug('findOneByEmail()');
		return this._userRepository.findOne({
			where: { email },
		});
	}

	async update(updateUserDto: UpdateUserDto): Promise<User> {
		this._logger.debug('update()');
		const { id, email, isEmailConfirmed, firstname, lastname, status, role } = updateUserDto;
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const user: User = await this._userRepository.findOne({
			where: { id },
			relations: ['profilePicture']
		});

		if (!user) throw new NotFoundException();

		// Controlo que las claves no estén en uso
		if (email) {
			const exists: User = await this._userRepository.findOne({
				where: { email },
			});

			// Si existe y no esta borrado lógico entonces hay conflictos
			if (exists && !exists.deleted && exists.id !== id)
				throw new ConflictException('Error: Keys already in use');
		}

		// Si no hay problemas actualizo los atributos
		if (email) user.email = email;
		if (isEmailConfirmed) user.isEmailConfirmed = isEmailConfirmed;
		if (firstname) user.firstname = firstname;
		if (lastname) user.lastname = lastname;
		if (status) user.status = status;
		if (role) user.role = role;
		user.updatedAt = timestamp;

		// Actualizo foto de perfil
		// Primero reviso si existía una foto de perfil previa y la marco como eliminada.
		if (updateUserDto.profilePicture) {
			// Si recibí una nueva foto de perfil
			// 1° Elimino la vieja
			if (user.profilePicture) {
				await this._utilsService.deletePicture(user.profilePicture.id);
			}

			// 2° La guardo en la DB
			const newProfilePicture: Picture = await await this._utilsService.saveProfilePicture(updateUserDto.profilePicture);

			// 3° Asigno la nueva foto al usuario
			user.profilePicture = newProfilePicture;
		}

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(user);
		if (errors && errors.length > 0) throw new NotAcceptableException();

		return this._userRepository.save(user);
	}

	async updateRefreshToken(id: number, refreshToken: string): Promise<User> {
		this._logger.debug('updateRefreshToken()');
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		const user: User = await this._userRepository.findOne({
			where: { id },
		});

		if (!user) {
			this._logger.debug('Error: Not Found');
			throw new NotFoundException('Error: Not Found');
		}

		user.refreshToken = refreshToken;
		user.updatedAt = timestamp;

		// Controlo que el modelo no tenga errores antes de guardar
		const errors = await validate(user);
		if (errors && errors.length > 0) {
			this._logger.debug('Error: Not Acceptable');
			throw new NotAcceptableException('Error: Not Acceptable');
		}

		return this._userRepository.save(user);
	}

	async updatePassword(user: User, password: string) {
		this._logger.debug('updatePassword()');
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');

		user.password = password;
		user.updatedAt = timestamp;

		return this._userRepository.save(user);
	}

	async delete(id: number): Promise<void> {
		this._logger.debug('delete()');
		const timestamp: any = moment().format('YYYY-MM-DD HH:mm:ss');
		const user: User = await this._userRepository.findOne({
			where: { id },
		});
		user.deleted = true;
		user.updatedAt = timestamp;
		this._userRepository.save(user);
	}

	async logout(id: number): Promise<void> {
		const user: User = await this._userRepository.findOne({
			where: { id },
		});
		user.refreshToken = null;
		this._userRepository.save(user);
	}

	async getUserFromRequest(request: Request): Promise<User> {
		this._logger.debug('getUserFromRequest()');
		const session: IJWTPayload = request.user as IJWTPayload;
		const user: User = await this._userRepository.findOne({
			where: { id: session.sub },
		});

		if (!user) {
			this._logger.debug('Error: Not Found');
			throw new NotFoundException('Error: Not Found');
		}

		return user;
	}

	async getProfilePicture(id: number): Promise<Picture> {
		this._logger.debug('getProfilePicture()');
		return this._utilsService.findOnePicture(id);
	}
}
