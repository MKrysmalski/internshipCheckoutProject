import { MailService } from '../mail/mail.service';
import { PdfService } from './../pdf/pdf.service';
import { PaypalService } from './../paypal/paypal.service';
import { Order, OrderSchema } from './order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports:[
    PaypalService,
    PdfService,
    MailService,
    MongooseModule.forFeature([ {name: Order.name, schema: OrderSchema} ]),
  ],
  controllers: [OrderController],
  providers: [OrderService,MailService]
})
export class OrderModule { }
