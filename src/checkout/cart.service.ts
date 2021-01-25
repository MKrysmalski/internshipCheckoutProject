import { AddItem } from './../grpc/grpc.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateItemDto } from './dto/update-item.dto';
import { DeleteItemDto } from './dto/delete-item.dto';
import { Cart, CartDocument } from './cart.schema';
import { v4 as uuid } from 'uuid';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name)
        private cartModel: Model<CartDocument>
    ) {}

    async create(createCartDto: CreateCartDto) {
        const cart = new this.cartModel();

        if(createCartDto.id) {
            cart.userId = createCartDto.id;
            const existingCart = await this.getCartByUserId(createCartDto.id);
            if(existingCart) {
                this.delete(existingCart._id);
            }
        }
        
        return cart.save();
    }

    async getCartById(id: uuid) : Promise<Cart> {
        try {      
            const cart = await this.cartModel.findById(id).exec();
            if(cart != null) {
                return cart;
            } else {
                return null;
            }
        } catch(error) {
            console.log(error);
        }
        
    }
    
    getCartByUserId(userId: uuid) : Promise<Cart> {
        return this.cartModel.findOne({ userId }).exec();
    }
    
    setUserToCart(cartId: uuid, userId: uuid) {
        return this.cartModel.update({ _id: cartId }, { userId });
    }

    delete(id: uuid) {
        try {
            this.cartModel.deleteOne({ _id: id }).exec();
            return {deleted: true, message: `Cart: ${id} deleted`}
        } catch(error) {
            return { deleted: false, message: error.message}
        } 
    }

    async addItem(id: uuid, addItem: AddItem) {
        let items = (await this.getCartById(id)).items;
        items = items.concat(addItem.items);
        
        const hashMap = new Map();

        for(const item of items) {
            if (hashMap.get(item.referencedId)) {
                hashMap.set(item.referencedId, 
                    { 
                        referencedId: item.referencedId,
                        quantity: hashMap.get(item.referencedId).quantity + item.quantity
                    }
                );
            } else {
                hashMap.set(item.referencedId, 
                    {
                        referencedId: item.referencedId,
                        quantity: item.quantity
                    }
                );
            }
        }

        return this.cartModel.updateOne({ _id: id }, { items: Array.from(hashMap.values()) }).exec();
    }

    async updateItem(id: uuid, updateItemDto: UpdateItemDto) : Promise<Cart> {
        const cart = await this.getCartById(id);
        const items = cart.items; 

        for(const updateItem of updateItemDto.items) {
            const index = items.findIndex(element => element.referencedId === updateItem.referencedId)
            items[index] = updateItem;
        }

        return this.cartModel.updateOne({ _id: id }, { items: items }).exec();
    }

    async deleteItem(id: uuid, deleteItemDto: DeleteItemDto) : Promise<Cart> {
        let items = (await this.getCartById(id)).items;
        items = items.filter(item => !(deleteItemDto.ids.indexOf(item.referencedId) > -1));
        return this.cartModel.updateOne({ _id: id }, { items: items }).exec();
    }
}