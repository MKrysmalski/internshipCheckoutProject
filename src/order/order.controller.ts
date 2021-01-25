/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DeleteOrderDto } from './dto/delete-order.dto';
import { GetOrderStatusDto } from './dto/get-order-by-status.dto';
import { GetOrderByIdDto } from './dto/get-order-by-id.dto';
import { CallbackDto } from './dto/callback.dto';
import { GetUserOrdersDto } from './dto/get-UserOrders.dto';
import { UpdateOrderStatusDto } from './dto/update-orderStatus.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';


@Controller('order')
export class OrderController {
    private logger = new Logger('OrderController');

    constructor(private orderService: OrderService) { }

    @GrpcMethod('AppController','CreateOrder')
    async createOrder(
        createOrderDto: CreateOrderDto,
    ) {
        //console.log(createOrderDto);
        const result = await this.orderService.createOrder(createOrderDto);
        console.log(result);
        return result;
        return {};
    }

    @GrpcMethod('AppController','GetAllOrders')
    async getAllOrders() {  
        return {orders: await this.orderService.getAllOrders()}
    }

    @GrpcMethod('AppController','GetUserOrders')
    async getUserOrders(
        getUserOrdersDto: GetUserOrdersDto
    ) {
        return {orders: await this.orderService.getUserOrders(getUserOrdersDto)};
    }

    @GrpcMethod('AppController','GetOrderById')
    async getOrderById(
        getOrder:GetOrderByIdDto
    ) {
        return await this.orderService.getOrderById(getOrder.id);
    }
    
    @GrpcMethod('AppController','GetOrderStatus')
    async getOrderStatus(
        orderStatus: GetOrderStatusDto
    ) {
        return {orderStatus:await this.orderService.getOrderAuthorization(orderStatus.id)};
    }
    
    @GrpcMethod('AppController','UpdateOrderStatus')
    async updateOrderStatus(
        updateOrder: UpdateOrderStatusDto
    ) {
        console.log(updateOrder.orderId);
        console.log(updateOrder.orderStatus);
        return await this.orderService.updateOrderStatus(updateOrder);
        
    }
    
    @GrpcMethod('AppController','DeleteOrder')
    async deleteOrder(
        deleteOrder: DeleteOrderDto
    ) {
        this.orderService.deleteOrder(deleteOrder.id);
        return {};
    }

    @GrpcMethod('AppController','DeleteUserOrders')
    async deleteUserOrders(
        deleteOrder: DeleteOrderDto) {
        this.orderService.deleteUserOrders(deleteOrder.id);
        return {};
    }

    @GrpcMethod('AppController','Callback')
    async callback(
        callbackDto: CallbackDto,
    ) {
        return await this.orderService.handleCallback(callbackDto);
    }
}
