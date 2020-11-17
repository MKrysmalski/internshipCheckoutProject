import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v4 as uuid } from 'uuid';
import { BillingInformation } from "./types/billing-information.type";
import { ShippingInformation } from "./types/shipping-information.type";

export type OrderDocument = Order & Document;

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: true
    },
})
export class Order {
    @Prop({
        type: String,
        default: uuid
    })
    readonly _id: string;

    @Prop()
    userId: uuid;

    @Prop()
    email: string

    @Prop()
    status: string;

    @Prop()
    shippingInformation: ShippingInformation;

    @Prop()
    billingInformation: BillingInformation;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
