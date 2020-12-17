import { Item } from './../../checkout/types/item.type';
import { BillingInformation } from './../types/billing-information.type';
import { ShippingInformation } from './../types/shipping-information.type';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'
export class CreateOrderDto {

    @IsEmail()
    @IsNotEmpty()
    email : string;

    @IsNotEmpty()
    authorized : boolean;

    @IsNotEmpty()
    userId : string;

    @IsNotEmpty()
    userSecret : string

    @IsNotEmpty()
    costs : number;

    @IsOptional()
    coupon : number;

    @IsOptional()
    items:{ name:string, quantity:number, cost:number }[];

}