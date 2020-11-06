import { ApiProperty } from "@nestjs/swagger";
import { Item } from "../types/item.type";

export class UpdateItemDto {
    @ApiProperty()
    items: Item[];
}
