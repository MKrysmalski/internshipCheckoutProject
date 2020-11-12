import { Injectable } from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
const nodemailer=require("nodemailer");
import { TwingEnvironment, TwingLoaderFilesystem } from 'twing';
import { MailConfig } from 'config/mailer.config'

@Injectable()
export class MailService {
    private readonly twing:TwingEnvironment;

    constructor(
        private readonly mailerService:MailerService,) {
            this.twing=new TwingEnvironment(
                new TwingLoaderFilesystem(MailConfig.templatePath))
        }

    async sendMail(templateName: string,data: any):Promise<void>{
        
        const template = await this.twing.load(templateName + '/' + templateName + '.twig');
        const html = await template.render(data);
        const result=await this.mailerService.sendMail({
            to: 'mk@7pkonzepte.de',
            from: 'ping@7pkonzepte.de',
            subject: `Email: ${templateName}`,
            html:html
        });
        console.log(result);
    }
}
