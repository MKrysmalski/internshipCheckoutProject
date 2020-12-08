import { Order } from './order.schema';

export interface OrderCreated {
    order:Order;
    payment:string;
}