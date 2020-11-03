import { ApiProperty } from "@nestjs/swagger";
import { Item } from "../types/item.interface";

export class AddItemDto {
    @ApiProperty()
    items: Item[];
}
