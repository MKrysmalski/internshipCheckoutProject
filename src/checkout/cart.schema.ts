import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';
import { Item } from "./types/item.type";
import { Document } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: true
    },
})
export class Cart {
    @Prop({
        type: String,
        default: uuid
    })
    readonly _id: string;

    @Prop({
        unique: true,
        index: true,
        type: String,
        sparse: true
    })
    userId: uuid;

    @Prop()
    items: Item[];

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);