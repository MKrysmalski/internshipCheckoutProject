import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
    imports: [
        MailerModule.forRoot( {
            transport: {
                host: 'w01553e9.kasserver.com',
                    port: 465,
                tls: {
                    ciphers: 'SSLv3',
                    rejectUnauthorized: false,
                },
                secure: true, // true for 465, false for other ports
                auth: {
                    user: 'm04542e1',
                    pass: 'JDZu-fdGUacP.r8xwG',
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
