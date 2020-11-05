import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        port: 465,
        tls: {
          ciphers: 'SSLv3',
        },
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'CheckoutMailer', // generated ethereal user
          pass: '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', // generated ethereal password
        },
      },
      defaults: {
        from: '"nest-modules" mk@7pkonzepte.de', // outgoing email ID
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
