import { PaypalService } from './paypal.service';
import { Body, Controller,Get, Param, Post, Req, Res } from '@nestjs/common';
import { request } from 'http';
import { response } from 'express';

@Controller('paypal')
export class PaypalController {
    constructor(private readonly paypalService: PaypalService){}

    @Get('/:id')
    async details(@Param('id')id:string){
        return await this.paypalService.orderDetails(id);
    }
    
    @Post('create')
    async Checkout(
        @Body('userId')userId:string,
        @Body('userSecret')userSecret:string){
        
            return await this.paypalService.createOrder(userId,userSecret);
    }

}
