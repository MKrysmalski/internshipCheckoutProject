import { Module } from '@nestjs/common';
import { TypegooseModule } from "nestjs-typegoose";

import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';

@Module({
    controllers: [CartController],
    imports: [
        TypegooseModule.forFeature([Cart]),
    ],
    providers: [CartService]
})
export class CartModule {}
