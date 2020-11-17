import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { CreateCartDto } from 'src/checkout/dto/create-cart.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Post('/checkout')
    createOrder(
        @Body(ValidationPipe)
        createOrderDto: CreateCartDto
    ) {
        
    }

    @Post('/checkout/callback')
    getOrder() {}


}
