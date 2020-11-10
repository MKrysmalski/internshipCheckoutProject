import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ValidateNested } from "class-validator";
import { Item } from "../types/item.type";

export class UpdateItemDto {
    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    items: Item[];
}
