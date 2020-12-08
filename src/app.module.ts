// Packages
import { Module } from '@nestjs/common';

// Modules
import { CartModule } from './checkout/cart.module';
import { PdfModule } from './pdf/pdf.module';
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from './mail/mail.module';
import { PaypalModule } from './paypal/paypal.module';

// Conifgs


@Module({
    imports: [
        MongooseModule.forRoot(""),
        CartModule,
        PdfModule,
        OrderModule,
        MailModule,
        PaypalModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
