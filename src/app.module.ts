import { Module } from '@nestjs/common';
import { ProductsModule } from './product/product.module';
import { PaypalModule } from './paypal/paypal.module';
import { CheckoutModule } from './checkout/checkout.module';


@Module({
    imports: [
        ProductsModule,
        PaypalModule,
        CheckoutModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
