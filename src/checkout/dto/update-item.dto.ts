import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { Item } from "../types/item.type";

export class UpdateItemDto {
    @ApiProperty()
    @IsArray()
    @ValidateNested()
    @Type(type => Item)
    items: Item[];
}
