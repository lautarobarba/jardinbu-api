import { Module } from '@nestjs/common';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { DatabaseModule } from 'database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FamilyModule } from './modules/family/family.module';
import { GenusModule } from './modules/genus/genus.module';
import { SpeciesModule } from './modules/species/species.module';
// import { SpecimenModule } from './modules/specimen/specimen.module';
// import { MailerModule } from './modules/mailer/mailer.module';

@Module({
	imports: [
		DatabaseModule,
		AuthModule,
		UserModule,
		FamilyModule,
		GenusModule,
		SpeciesModule,
		// SpecimenModule,
		// MailerModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	static port: number | string;

	constructor() {
		AppModule.port = process.env.APP_PORT || 3000;
	}
}
