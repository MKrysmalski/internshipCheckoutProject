import { IsOptional,IsNotEmpty } from 'class-validator';
export class ShippingInformationDto {
    
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
}