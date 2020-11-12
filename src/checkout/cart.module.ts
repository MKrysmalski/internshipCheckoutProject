import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from './cart.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    controllers: [CartController],
    imports: [
        MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])
    ],
    providers: [CartService]
})
export class CartModule {}
