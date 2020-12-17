import { OrderDocument } from './../order/order.schema';
import { Injectable, Controller, InternalServerErrorException } from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import { TwingEnvironment, TwingLoaderFilesystem } from 'twing';
import { MailConfig } from 'config/example.mailer.config'
import { Logger } from '@nestjs/common';

@Injectable()
export class MailService {
    private readonly twing:TwingEnvironment;
    private logger = new Logger('mailService');
    constructor(private readonly mailerService:MailerService) {
            this.twing=new TwingEnvironment(
                new TwingLoaderFilesystem(MailConfig.templatePath))
        }

    async sendMail(templateName: string,data: OrderDocument,pdf:any):Promise<void>{
            
            let template = await this.twing.load(templateName + '/' + templateName + '.twig');

            let html = await template.render(data);

            let result = await this.mailerService.sendMail( {
                to: 'mk@7pkonzepte.de',
                from: 'ping@7pkonzepte.de',
                subject: `Email: ${templateName}`,
                html:html,
                attachments:[{contentType:"application/pdf",filename:"Rechnung.pdf",content:pdf}]
            });
            
            this.logger.verbose(result); 
    }
}
