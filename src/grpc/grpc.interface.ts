import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';
import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Item } from './../checkout/types/item.type';

export interface CartId {
    id:string;
}

export interface UserId {
    id:string;
}

export class AddItem {
    @ApiProperty()
    @IsArray()
    @ValidateNested()
    @Type(type => Item)
    items: Item[];

    @IsUUID()
    id:string;
}