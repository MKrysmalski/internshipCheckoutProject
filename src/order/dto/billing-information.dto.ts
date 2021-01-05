import { IsOptional } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class BillingInformationDto{
    
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