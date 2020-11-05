// Packages
import { Module } from '@nestjs/common';
import { TypegooseModule } from "nestjs-typegoose";

// Modules
import { CartModule } from './checkout/cart.module';
import { PdfModule } from './pdf/pdf.module';

// Conifgs
import { OrderModule } from './order/order.module';
import { MailModule } from './mail/mail.module';

@Module({
    imports: [
        TypegooseModule.forRoot("mongodb://localhost:27017/murtfeld", {
            useNewUrlParser: true,
        }),
        CartModule,
        PdfModule,
        OrderModule,
        MailModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
