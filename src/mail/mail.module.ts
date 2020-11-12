import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'w01553e9.kasserver.com',
        port: 465,
        tls: {
          ciphers: 'SSLv3',
        },
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'm04542e1', // generated ethereal user
          pass: 'JDZu-fdGUacP.r8xwG', // generated ethereal password
        },
      },
      defaults: {
        from: '"nest-modules" ping@7pkonzepte.de', // outgoing email ID
      },
      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  controllers: [MailController]
})
export class MailModule {}
