import { Controller, Get, Res, Render, Header } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { Readable } from 'stream';

@Controller('pdf')
export class PdfController {
    constructor(private pdfService: PdfService) {}

    @Get()
    @Header('Content-Type', 'application/pdf')
    async render(@Res() response: Response) {
        /*const buffer = await this.pdfService.generatePdf('wago', 
            {
                items: [
                    'test1',
                    'test2',
                    'test3',
                ]
            }
        );
        const stream = new Readable();

        stream.push(buffer);
        stream.push(null);

        stream.pipe(response);
        */
    }
}