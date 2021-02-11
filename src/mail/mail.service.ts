/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
require('dotenv').config()
import { OrderDocument } from './../order/order.schema';
import { Injectable } from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import { TwingEnvironment, TwingLoaderFilesystem } from 'twing';
import { Logger } from '@nestjs/common';

@Injectable()
export class MailService {
    private readonly twing:TwingEnvironment;
    private logger = new Logger('mailService');
    constructor(private readonly mailerService:MailerService) {
            this.twing=new TwingEnvironment(
                new TwingLoaderFilesystem(__dirname + '/templates'))
        }

    async sendMail(data: OrderDocument, pdf: any):Promise<void> {
        let mailAddr=undefined;
        if (data.billingInformation.paymentMethod == "prepaid") {
            mailAddr = data.billingInformation.email;//Bei Vorkasse: Email an Kunde mit BankDaten von Wago/Murtfeldt

        } else if (data.billingInformation.paymentMethod == "billing") {
            mailAddr = data.billingInformation.email;//Bei Zahlen auf Rechnung: Bestellbestätigung mit Rechnung

        } else if (data.billingInformation.paymentMethod == "paypal" ) {
            mailAddr = data.billingInformation.email;//Bei Paypal: Bestellbestätigung mit Rechnung bei erfolgreicher Zahlung

        } else if (data.billingInformation.paymentMethod == "quote") {//Bei Angebot: Email an Wago/Murtfeldt mit der jeweiligen Bestellung
            if (data.billingInformation.billingBrandName=="wago") {
                mailAddr = "wago@email.de";

            } else if( data.billingInformation.billingBrandName=="murtfeldt" ) {
                mailAddr = "murtfeldt@email.de";

            } else {
                return null;
            }
        } else {
            return null;
        }
        const template = await this.twing.load(data.billingInformation.billingBrandName + '/' + data.billingInformation.paymentMethod + '.twig');

        const html = await template.render(data);
        
        try {
            const result = await this.mailerService.sendMail( {
                to: process.env.MAIL_RECEIVER,//mailAddr
                from: process.env.MAIL,
                subject: `Email: ${data.billingInformation.billingBrandName + ' ' + data.billingInformation.paymentMethod}`,
                html:html,
                attachments:[{contentType:"application/pdf",filename:"Rechnung.pdf",content:pdf}]
            });
            this.logger.verbose(result);
        } catch(error) {
            this.logger.log('Error: '+error);
        } 
    }
}
