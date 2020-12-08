import { IsNotEmpty } from 'class-validator';
export class GetUserOrdersDto{
    
    @IsNotEmpty()
    userId:string;
}