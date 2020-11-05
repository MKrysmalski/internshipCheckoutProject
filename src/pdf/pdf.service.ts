import { Injectable } from '@nestjs/common';
import { TwingEnvironment, TwingLoaderFilesystem } from 'twing';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
    private twing: TwingEnvironment;

    constructor() {
        this.twing = new TwingEnvironment(
            new TwingLoaderFilesystem('/home/michael/projects/CheckoutProject/Checkout/src/pdf/templates')
        );
    }

    async generatePdf(templateName: string, data: any) : Promise<Buffer> {
        const template = await this.twing.load(templateName + '/' + templateName + '.twig');
        const html = await template.render(data);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);

        const pdf = await page.pdf({ path: 'invoice.pdf', format: 'A4' });
        await browser.close();

        return pdf;
    }
}
