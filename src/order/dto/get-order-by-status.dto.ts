import { IsNotEmpty } from 'class-validator';
export class GetOrderStatusDto {
    
    @IsNotEmpty()
    id:string;
}