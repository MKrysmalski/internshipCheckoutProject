import { CallbackDto } from './dto/callback.dto';
import { OrderCreated } from '../order/orderCreated';
import { ShippingInformationDto } from './dto/shipping-information.dto';
import { BillingInformationDto } from './dto/billing-information.dto';
import { GetUserOrdersDto } from './dto/get-UserOrders.dto';
import { Order } from './order.schema';
import { UpdateOrderStatusDto } from './dto/update-orderStatus.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe, Res, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Logger } from '@nestjs/common';


@Controller('order')
export class OrderController {
    private logger = new Logger('OrderController');

    constructor(private orderService: OrderService) { }

    @Post('/checkout')
    async createOrder(
        @Body(ValidationPipe)
        createOrderDto: CreateOrderDto,
        @Body(ValidationPipe)
        billingInformationDto: BillingInformationDto,
        @Body(ValidationPipe)
        shippingInformationDto: ShippingInformationDto
    ) : Promise<OrderCreated> 
    {
        return this.orderService.createOrder(createOrderDto, shippingInformationDto, billingInformationDto);
    }

    @Get('/test')
    async getAllOrders(): Promise<Order[]> 
    {//for Debugging
        return await this.orderService.getAllOrders();
    }

    @Get('/user/:userId')
    async getUserOrders(
        @Param(ValidationPipe)
        getUserOrdersDto: GetUserOrdersDto
    ) : Promise<Order[]>
    {
        return await this.orderService.getUserOrders(getUserOrdersDto);
    }

    @Get('/:id')
    async getOrderById(
        @Param('id') 
        orderId:string
    ) : Promise<Order> 
    {
        return await this.orderService.getOrderById(orderId);
    }
    
    @Get('/:id/status')
    async getOrderStatus(
        @Param('id')
        orderId: string
    ) : Promise<boolean> 
    {
        return await this.orderService.getOrderAuthorization(orderId);
    }
    
    @Patch('/:id/status')
    async updateOrderStatus(
        @Param('id') orderId:string,
        @Body(ValidationPipe) updateOrderStatusDto: UpdateOrderStatusDto
    ) : Promise<Order> 
    {
        return await this.orderService.updateOrderStatus(orderId,updateOrderStatusDto)
    }
    
    @Delete('/:id')
    async deleteOrder(
        @Param('id') orderId:string
    ) : Promise<void>
    {
        return await this.orderService.deleteOrder(orderId);
    }

    @Delete(':id/userOrders')
    async deleteUserOrders(@Param('id') userId: string) : Promise<void> 
    {
        this.orderService.deleteUserOrders(userId);
    }
    //http://localhost:3000/order/checkout/callback?success=false&token=2Y346936BH061722B&PayerID=FBXWKDHHHTBLG

    @Post('/checkout/callback')
    async callback(
        @Body(ValidationPipe) callbackDto:CallbackDto,
    ) {
        return await this.orderService.handleCallback(callbackDto);
    }
}
