import { CallbackDto } from './dto/callback.dto';
import { MailService } from '../mail/mail.service';
import { PdfService } from './../pdf/pdf.service';
import { BillingInformation } from './types/billing-information.type';
import { GetUserOrdersDto } from './dto/get-UserOrders.dto';
import { UpdateOrderStatusDto } from './dto/update-orderStatus.dto';
import { Order, OrderDocument } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Injectable } from '@nestjs/common';
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
    private logger = new Logger('orderService');

    constructor(
        @InjectModel(Order.name)
        private orderModel:Model<OrderDocument>,
        private mailService:MailService,
        private pdfService:PdfService
    ) { }

    async createOrder(
        createOrderDto: CreateOrderDto,
    ): Promise<OrderCreated> {
        const{ 
            email, 
            authorized, 
            userId, 
            costs, 
            items,
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
            billingGender,
            billingBirthday,
            billingCurrencyCode,
            billingBrandName,
            billingPaymentMethod,
            shippingStreet,
            shippingCity,
            shippingPostalCode,
            shippingCompany,
            shippingAddressSuffix,
            shippingFirstname,
            shippingLastname,
            shippingGender  } = createOrderDto;

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
                billingGender,
                billingBirthday,
                billingCurrencyCode,
                billingBrandName,
                billingPaymentMethod
            );

            let shippingInformation = new ShippingInformation(
                shippingStreet,
                shippingCity,
                shippingPostalCode,
                shippingCompany,
                shippingAddressSuffix,
                shippingFirstname,
                shippingLastname,
                shippingGender
            );

        const order = new this.orderModel();
        
        order.userId = userId;
        order.orderId = uuid();
        order.email = email;
        order.authorized = authorized;
        order.status = "CREATED";
        order.costs = costs;
        order.items = items;
        order.shippingInformation = shippingInformation;
        order.billingInformation = billingInformation;
        
        if (order.billingInformation.paymentMethod=="paypal") {
            try {
                /*
                Email versenden sobald Besellung erfolgreich.
                */
                const paymentResponse = await this.paypalService.createOrder(userId,shippingInformation,billingInformation,order.costs);
                order.paymentId = paymentResponse.paymentId;
                order.status="WAIT FOR PAYPALAUTHENTICATION";
                this.logger.verbose(`Order: ${order.orderId} successfully created for user: ${order.userId}`);
                return {
                    order: await order.save(),
                    payment: paymentResponse.authUrl
                };
            } catch (error) {
                throw error;
            } 
        } else if (order.billingInformation.paymentMethod=="prepaid") {

            /*
            Email versenden mit Bankdaten und Bestellung
            */
            const pdf = await this.pdfService.generatePdf(order);
            await this.mailService.sendMail(order,pdf);
            order.status='WAIT FOR PAYMENT';

            return { 
                order: await order.save(),
                payment:`Email send to ${ order.billingInformation.email }: ${order.status}`
            }

        } else if (order.billingInformation.paymentMethod=="billing") {

            /*
            Email verenden mit Bankdaten und Bestellung
            */
            const pdf = await this.pdfService.generatePdf(order);
            await this.mailService.sendMail(order,pdf);
            order.status='WAIT FOR PAYMENT';
            return {
                order: await order.save(),
                payment: `Email send to ${ order.billingInformation.email }: ${ order.status }`
            }

        } else if (order.billingInformation.paymentMethod == "deal") {

            /*
            email an Versender schicken mit entsprechendem Einkaufswagen
            */
            const pdf = await this.pdfService.generatePdf(order);
            order.status='WAIT FOR DEAL';
            await this.mailService.sendMail(order,pdf);
            return {
                order: await order.save(),
                payment: `Email send to ${ order.billingInformation.email }: ${ order.status }`
            }
        } else {
            return null;
        }
    }

    getOrderById(id:string) : Promise<Order> {
        
        try {
            this.logger.verbose(`get order with id ${id}`);
            return this.orderModel.findOne({orderId:id}).exec();
        } catch(error) {
            this.logger.error(error.stack);
            throw error;
        }
    }
    
    getUserOrders(getUserOrderDto: GetUserOrdersDto) : Promise<Order[]> {
        
        const { id } = getUserOrderDto;
    
        try{
            this.logger.verbose(`get user orders with userid ${id}`);
            return this.orderModel.find().where("userId",id).exec();
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
    
    async updateOrderStatus(updateOrder:UpdateOrderStatusDto) : Promise<Order> {
        
        try {
            this.logger.verbose(`update orderstatus with orderid ${updateOrder.orderId} to ${updateOrder.orderStatus}`);
            let order =  await this.orderModel.findOne({orderId:updateOrder.orderId});
            order.status = updateOrder.orderStatus;
            return await order.save();
        } catch(error) {
            this.logger.error(error.stack);
            throw error;
        }
    }

    async deleteOrder(id: string) : Promise<void> {
        
        try {
            this.logger.verbose(`delete order with orderid ${id}`);
            await this.orderModel.deleteOne({orderId:id}).exec();
        } catch(error) {
            this.logger.error(error.stack);
            throw error;
        }
    }

    async deleteUserOrders(userId: string) : Promise<void> {
        
        try {
            this.logger.verbose(`delete orders with from user with userid ${userId}`);
            await this.orderModel.deleteMany({ "userId":userId });
        } catch(error) {
            this.logger.error(error.stack);
            throw error;
        }
    }

    getAllOrders() : Promise<Order[]> {
        
        try {
            this.logger.verbose(`get all orders`);
            return this.orderModel.find().exec();
        } catch(error) {
            this.logger.error(error.stack);
            throw error;
        }
    }

    async handleCallback(callbackDto: CallbackDto) {
        
        let { success, token, PayerID } = callbackDto;
        let order = undefined;
        this.logger.verbose(`callback received with id ${ PayerID }`);
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

                const pdf = await this.pdfService.generatePdf(order);

                const response = await Promise.all([
                    order.save(),
                    this.mailService.sendMail(order,pdf),
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