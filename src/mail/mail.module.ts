import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from "@nestjs-modules/mailer";
import { MailConfig } from 'config/example.mailer.config'

@Module({
    imports: [
        MailerModule.forRoot( {
            transport: MailConfig.connection,
            defaults: {
                from: '"nest-modules"' + process.env.MAIL, // outgoing email ID
            },
        }),
    ],
    providers: [MailService],
    controllers: [MailController],
    exports: [MailService]
})
export class MailModule { }
