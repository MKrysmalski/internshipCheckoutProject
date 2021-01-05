import { IsNotEmpty } from 'class-validator';
export class DeleteOrderDto {
    
    @IsNotEmpty()
    id: string;
}