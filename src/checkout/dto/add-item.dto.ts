import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { Item } from "../types/item.type";

export class AddItemDto {
    @ApiProperty()
    @IsArray()
    items: Item[];
}
