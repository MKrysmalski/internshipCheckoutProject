import { IsOptional, IsUUID } from "class-validator";

export class CreateCartDto {
    @IsOptional()
    @IsUUID()
    id: string;
}