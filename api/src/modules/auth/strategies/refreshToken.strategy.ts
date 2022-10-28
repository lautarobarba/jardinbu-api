import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { IJWTPayload } from '../jwt-payload.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh'
) {
	constructor(private readonly _userService: UserService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: IJWTPayload) {
		const { email } = payload;

		const user: User = await this._userService.findOneByEmail(email);

		if (!user) {
			throw new UnauthorizedException();
		}

		const refreshToken: string = req
			.get('Authorization')
			.replace('Bearer', '')
			.trim();

		return { payload, refreshToken };
	}
}
