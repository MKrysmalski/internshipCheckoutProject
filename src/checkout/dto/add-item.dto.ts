import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ValidateNested } from "class-validator";
import { Item } from "../types/item.type";

export class AddItemDto {
    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    items: Item[];
}
