import { IsNotEmpty } from "class-validator";

export class CallbackDto {

    @IsNotEmpty()
    success:boolean;

    @IsNotEmpty()
    token:string;

    @IsNotEmpty()
    PayerID:string;
}