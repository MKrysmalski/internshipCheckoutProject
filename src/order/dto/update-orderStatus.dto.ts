import{ IsNotEmpty } from 'class-validator'
export class UpdateOrderStatusDto{

    @IsNotEmpty()
    orderStatus: string;

    @IsNotEmpty()
    orderId: string;
}