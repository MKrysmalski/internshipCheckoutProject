import { IsNotEmpty } from 'class-validator';
export class GetOrderByIdDto {
    
    @IsNotEmpty()
    id:string;
}