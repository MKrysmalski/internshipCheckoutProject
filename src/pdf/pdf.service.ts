import { OrderDocument } from './../order/order.schema';
import { Injectable } from '@nestjs/common';
import { TwingEnvironment, TwingLoaderFilesystem } from 'twing';
import * as puppeteer from 'puppeteer';
import { Logger } from '@nestjs/common';

@Injectable()
export class PdfService {
    
    private twing: TwingEnvironment;
    private logger = new Logger('pdfService');

    constructor() {
        this.twing = new TwingEnvironment(
            new TwingLoaderFilesystem(__dirname + '/templates')
        );
    }

    async generatePdf(order: OrderDocument) : Promise<Buffer> {
        
        
        const template = await this.twing.load(order.billingInformation.billingBrandName+ '/' + order.billingInformation.paymentMethod + '.twig');
        
        const html = await template.render(order);
        
        const browser = await puppeteer.launch();
        
        const page = await browser.newPage();
        await page.setContent(html);
        
        const pdf = await page.pdf({ path: 'invoice.pdf', format: 'A4' });
        await browser.close();

        this.logger.verbose(`pdf successfully created`);
        return pdf;
    }
}
