import { CallbackDto } from './dto/callback.dto';
import { MailService } from '../mail/mail.service';
import { PdfService } from './../pdf/pdf.service';
import { BillingInformation } from './types/billing-information.type';
import { BillingInformationDto } from './dto/billing-information.dto';
import { ShippingInformationDto } from './dto/shipping-information.dto';
import { GetUserOrdersDto } from './dto/get-UserOrders.dto';
import { UpdateOrderStatusDto } from './dto/update-orderStatus.dto';
import { Order, OrderDocument } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ShippingInformation } from './types/shipping-information.type';
import { PaypalService } from '../paypal/paypal.service';
import { OrderCreated } from '../order/orderCreated'
import { Logger } from '@nestjs/common';

@Injectable()
export class OrderService {
    
    private paypalService=new PaypalService();
    private pdfService=new PdfService();
    private logger = new Logger('orderService');

    constructor(
        @InjectModel(Order.name)
        private orderModel:Model<OrderDocument>,
        private mailService:MailService
    ){ }

    async createOrder(
        createOrderDto: CreateOrderDto,
        shippingInformationDto: ShippingInformationDto,
        billingInformationDto: BillingInformationDto
    ):Promise<OrderCreated> {
        
        const { 
            billingCountryCode,
            billingStreet,
            billingCity,
            billingCountry,
            billingPostalCode,
            billingCompany,
            billingAddressSuffix,
            billingEmail,
            billingTitle,
            billingFirstname,
            billingLastname,
            billingBirthday,
            billingCurrencyCode,
            billingBrandName,
            billingPaymentMethod 
        } = billingInformationDto

        let billingInformation = new BillingInformation (
            billingCountryCode,
            billingStreet,
            billingCity,
            billingCountry,
            billingPostalCode,
            billingCompany,
            billingAddressSuffix,
            billingEmail,
            billingTitle,
            billingFirstname,
            billingLastname,
            billingBirthday,
            billingCurrencyCode,
            billingBrandName,
            billingPaymentMethod
        );
        
        const { 
            shippingStreet,
            shippingCity,
            shippingPostalCode,
            shippingCompany,
            shippingAddressSuffix,
            shippingFirstname,
            shippingLastname 
        } = shippingInformationDto

        let shippingInformation = new ShippingInformation(
            shippingStreet,
            shippingCity,
            shippingPostalCode,
            shippingCompany,
            shippingAddressSuffix,
            shippingFirstname,
            shippingLastname
        );
        
        const{ email, authorized, userId, userSecret, costs, coupon } = createOrderDto;
        const order = new this.orderModel();
        
        order.userId = userId;
        order.orderId = uuid();
        order.email = email;
        order.authorized = authorized;
        order.status = "CREATED";
        order.costs = costs - costs * coupon; // Coupon Calculation
        order.shippingInformation = shippingInformation;
        order.billingInformation = billingInformation;
        
        const paymentResponse: boolean = null;

        try {
            const paymentResponse = await this.paypalService.createOrder(userId,userSecret,shippingInformation,billingInformation,order.costs);
            order.paymentId = paymentResponse.paymentId;
            this.logger.verbose(`Order: ${order.orderId} successfully created for user: ${order.userId}`);
            return {
                order: await order.save(),
                payment: paymentResponse.authUrl
            };
        } catch (error) {
            throw error;
        } 
    }

    getOrderById(id:string) : Promise<Order> {
        
        try {
            this.logger.verbose(`get order with id ${id}`);
            return this.orderModel.findById(id).exec();
        } catch(error) {
            this.logger.error(error.stack);
            throw error;
        }
    }
    
    getUserOrders(getUserOrderDto: GetUserOrdersDto) : Promise<Order[]> {
        
        const { userId } = getUserOrderDto;
    
        try{
            this.logger.verbose(`get user orders with userid ${userId}`);
            return this.orderModel.find({ userId: userId }).exec();
        } catch(error) {
            this.logger.error(error.stack);
            throw error;
        }
    }

    async getOrderAuthorization(id: string) : Promise<boolean> {
        
        try {
            this.logger.verbose(`get order authorization with orderid ${id}`);
            return (await this.getOrderById(id)).authorized;
        } catch(error) {
            this.logger.error(error.stack);
            throw error;
        }
    }
    
    updateOrderStatus(id:string,updateOrderStatusDto:UpdateOrderStatusDto) : Promise<Order> {
        
        try {
            this.logger.verbose(`update orderstatus with orderid ${id} to ${updateOrderStatusDto.orderStatus}`);
            return this.orderModel.findByIdAndUpdate(id, { "status": updateOrderStatusDto.orderStatus }).exec();
        } catch(error) {
            this.logger.error(error.stack);
            throw error;
        }
    }

    async deleteOrder(id: string) : Promise<void> {
        
        try{
            this.logger.verbose(`delete order with orderid ${id}`);
            await this.orderModel.findByIdAndDelete(id).exec();
        } catch(error) {
            this.logger.error(error.stack);
            throw error;
        }
    }

    async deleteUserOrders(userId: string) : Promise<void> {
        
        try{
            this.logger.verbose(`delete orders with from user with userid ${userId}`);
            await this.orderModel.deleteMany({ "userId":userId });
        } catch(error) {
            this.logger.error(error.stack);
            throw error;
        }
    }

    getAllOrders() : Promise<Order[]>{
        
        try {
            this.logger.verbose(`get all orders`);
            return this.orderModel.find().exec();
        } catch(error) {
            this.logger.error(error.stack);
            throw error;
        }
    }

    async handleCallback(callbackDto: CallbackDto) {
        
        let { success, token, PayerID }=callbackDto;
        let order = undefined;
        this.logger.verbose(`callback received with id ${PayerID}`);
        try{
            order = await this.orderModel.findOne({ paymentId: token });
            order.authorized = success;
            order.payerId = PayerID;
            order.status = "INPROGRESS";
            await order.save();
        } catch(error) {
            this.logger.error(error.stack);
            throw error;
        }

        if(order.authorized) {
            try {
                order.status="PAYED";
                this.logger.verbose(`Order: ${order.orderId} successfully authorized for user: ${order.userId}`);

                const pdf = await this.pdfService.generatePdf(order.billingInformation.billingBrandName,"");

                const response = await Promise.all([
                    order.save(),
                    this.mailService.sendMail(order.billingInformation.billingBrandName,"",pdf),
                ]);

                return response[0];
            } catch(error) {
                this.logger.error(error.stack);
                throw error;
            }
        } else {
            order.status="PAYMENT_FAILED";
            try {
                this.logger.verbose(`Order: ${order.orderId} authorization for user: ${order.userId} failed`);
                return await order.save();;
            } catch(error) {
                this.logger.error(error.stack);
                throw error;
            }
        }
    }
}