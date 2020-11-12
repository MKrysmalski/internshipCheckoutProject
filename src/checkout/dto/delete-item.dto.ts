import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";

export class DeleteItemDto {
    @ApiProperty()
    @IsArray()
    @IsUUID(
        4,
        { each: true }
    )
    ids: string[];
}
