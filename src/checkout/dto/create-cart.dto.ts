import { Prop } from "@nestjs/mongoose";
import { IsOptional, IsUUID } from "class-validator";

export class CreateCartDto {
    @IsOptional()
    @IsUUID()
    userId: string;
}