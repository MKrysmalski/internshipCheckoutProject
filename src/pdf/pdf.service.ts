import { OrderDocument } from './../order/order.schema';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TwingEnvironment, TwingLoaderFilesystem } from 'twing';
import * as puppeteer from 'puppeteer';
import { PdfConfig } from '../../config/example.pdf.config'
import { Logger } from '@nestjs/common';

@Injectable()
export class PdfService {
    
    private twing: TwingEnvironment;
    private logger = new Logger('pdfService');

    constructor() {
        this.twing = new TwingEnvironment(
            new TwingLoaderFilesystem(PdfConfig.templatePath)
        );
    }

    async generatePdf(templateName: string, data: OrderDocument) : Promise<Buffer> {
        
        
        let template = await this.twing.load(templateName + '/' + templateName + '.twig');
        
        let html = await template.render(data);
        
        let browser = await puppeteer.launch();
        
        let page = await browser.newPage();
        await page.setContent(html);
        
        let pdf = await page.pdf({ path: 'invoice.pdf', format: 'A4' });
        await browser.close();

        this.logger.verbose(`pdf successfully created`);
        return pdf;
    }
}
