import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from "@nestjs-modules/mailer";
import { MailConfig } from 'config/mailer.config'

@Module({
    imports: [
        MailerModule.forRoot({
            transport: MailConfig.connection,
            defaults: {
                from: '"nest-modules" ping@7pkonzepte.de', // outgoing email ID
            },
        }),
    ],
    providers: [MailService],
    controllers: [MailController]
})
export class MailModule {}
