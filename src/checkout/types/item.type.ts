import { IsNumber, IsPositive, IsUUID } from "class-validator";

export class Item {
    @IsUUID()
    referencedId: string;

    @IsNumber()
    @IsPositive()
    quantity: number;
}