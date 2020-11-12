import { IsUUID } from "class-validator";

export class GetUserCartDto {
    @IsUUID()
    userId: string
}