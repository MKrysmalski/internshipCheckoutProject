import { IsNumber, IsOptional, IsUUID } from "class-validator";

export class Item {
    @IsUUID()
    referencedId: string;

    @IsOptional()
    @IsNumber()
    quantity?: number;
}
