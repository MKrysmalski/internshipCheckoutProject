import { IsNotEmpty } from 'class-validator';
export class GetUserOrdersDto {
    
    @IsNotEmpty()
    id:string;
}