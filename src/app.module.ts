// Packages
import { Module } from '@nestjs/common';
// Modules
import { CartModule } from './checkout/cart.module';
import { PdfModule } from './pdf/pdf.module';

// Conifgs
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRoot("mongodb://localhost:27017/murtfeld"),
        CartModule,
        PdfModule,
        OrderModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
