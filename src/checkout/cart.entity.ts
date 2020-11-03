import { prop } from "@typegoose/typegoose";
import { v4 as uuid } from 'uuid';
import { Item } from "./types/item.interface";


export class Cart {
    @prop()
    readonly _id: string;

    @prop({
        unique: true,
        index: true,
        type: String,
        sparse: true
    })
    userId: uuid;

    @prop()
    items: Item[];

    @prop()
    readonly createdAt: Date;

    @prop()
    readonly updatedAt: Date;
}