import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
    imports: [
        MailerModule.forRoot( {
            transport: {
                host: process.env.MAILER_HOST,
                    port: process.env.MAILER_PORT,
                tls: {
                    ciphers: process.env.MAILER_TLS_CIPHERS,
                    rejectUnauthorized: false,
                },
                secure: true, // true for 465, false for other ports
                auth: {
                    user: process.env.MAILER_USER,
                    pass: process.env.MAILER_PASSWORD,
                },
            },
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
