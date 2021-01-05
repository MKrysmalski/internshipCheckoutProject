import { Item } from './../../checkout/types/item.type';
import { BillingInformation } from './../types/billing-information.type';
import { ShippingInformation } from './../types/shipping-information.type';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'
export class CreateOrderDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    authorized: boolean;

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    userSecret: string

    @IsNotEmpty()
    costs: number;

    @IsOptional()
    coupon: number;

    @IsOptional()
    items: { referencedId:string, quantity:number, costs:number }[];

    //SHIPPING

    @IsNotEmpty()
    shippingStreet: string;
    
    @IsNotEmpty()
    shippingCity: string;
    
    @IsNotEmpty()
    shippingPostalCode: string;
    
    @IsOptional()
    shippingCompany: string;
    
    @IsNotEmpty()
    shippingAddressSuffix: string;
    
    @IsNotEmpty()
    shippingFirstname: string;
    
    @IsNotEmpty()
    shippingLastname: string;

    //BILLING

    @IsNotEmpty()
    billingCountryCode: string;

    @IsNotEmpty()
    billingStreet: string;

    @IsNotEmpty()
    billingCity: string;

    @IsNotEmpty()
    billingCountry: string

    @IsNotEmpty()
    billingPostalCode: string;

    @IsOptional()
    billingCompany: string;

    @IsNotEmpty()
    billingAddressSuffix: string;

    @IsNotEmpty()
    billingEmail: string;

    @IsOptional()
    billingTitle: string;

    @IsNotEmpty()
    billingFirstname: string;

    @IsNotEmpty()
    billingLastname: string;

    @IsNotEmpty()
    billingBirthday: string;

    @IsNotEmpty()
    billingCurrencyCode: string;

    @IsNotEmpty()
    billingBrandName: string;

    @IsNotEmpty()
    billingPaymentMethod: string;

}