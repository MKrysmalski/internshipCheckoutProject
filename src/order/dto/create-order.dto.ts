import { PaymentMethod, BillingBrandName, Gender } from './../order.enum';
import { IsArray, IsBoolean, IsCurrency, IsDecimal, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPostalCode, IsString } from 'class-validator'
export class CreateOrderDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsBoolean()
    authorized: boolean;

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsOptional()
    @IsCurrency()
    costs: number;

    @IsOptional()
    @IsDecimal()
    coupon: number;

    @IsOptional()
    @IsArray()
    items: { 
        referencedId:string, 
        quantity:number, 
        costs:number 
    }[];

    //SHIPPING

    @IsNotEmpty()
    @IsString()
    shippingStreet: string;
    
    @IsNotEmpty()
    @IsString()
    shippingCity: string
    
    @IsNotEmpty()
    @IsPostalCode()
    @IsString()
    shippingPostalCode: string;
    
    @IsOptional()
    @IsString()
    shippingCompany: string;
    
    @IsNotEmpty()
    @IsString()
    shippingAddressSuffix: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(Gender)
    shippingGender: string;
    
    @IsNotEmpty()
    @IsString()
    shippingFirstname: string;
    
    @IsNotEmpty()
    @IsString()
    shippingLastname: string;

    //BILLING

    @IsNotEmpty()
    billingCountryCode: string;

    @IsNotEmpty()
    billingStreet: string;

    @IsNotEmpty()
    billingCity: string;

    @IsNotEmpty()
    billingCountry: string;

    @IsNotEmpty()
    @IsPostalCode()
    billingPostalCode: string;

    @IsOptional()
    billingCompany: string;

    @IsNotEmpty()
    billingAddressSuffix: string;

    @IsNotEmpty()
    @IsEmail()
    billingEmail: string;

    @IsOptional()
    billingTitle: string;

    @IsNotEmpty()
    billingFirstname: string;

    @IsNotEmpty()
    billingLastname: string;

    @IsNotEmpty()
    @IsEnum(Gender)
    billingGender: string;

    @IsNotEmpty()
    billingBirthday: string;

    @IsNotEmpty()
    billingCurrencyCode: string;

    @IsNotEmpty()
    @IsEnum(BillingBrandName)
    billingBrandName: string;

    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    billingPaymentMethod: string;

}