import { Injectable } from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
const nodemailer=require("nodemailer");

@Injectable()
export class MailService {
    constructor(private readonly mailerService:MailerService) {}
    async sendMail():Promise<void>{
        const result=await this.mailerService.sendMail({
                to: 'example@example.de',
                from: 'example@example.com',
                subject: 'example',
                text: 'example',
                html:'<p>Example</p>'
        });
        console.log(result);
    }
}
