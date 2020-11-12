import { Injectable } from '@nestjs/common';
import { AddItemDto } from './dto/add-item.dto';
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

        if(createCartDto.userId) {
            cart.userId = createCartDto.userId;
            const existingCart = await this.getCartByUserId(createCartDto.userId);
            if(existingCart) {
                this.delete(existingCart._id);
            }
        }
        
        return cart.save();
    }

    getCartById(id: uuid) : Promise<Cart> {
        return this.cartModel.findById(id).exec();
    }
    
    getCartByUserId(userId: uuid) : Promise<Cart> {
        return this.cartModel.findOne({ userId }).exec();
    }
    
    setUserToCart(cartId: uuid, userId: uuid) {
        return this.cartModel.update({ _id: cartId }, { userId });
    }

    delete(id: uuid) {
        this.cartModel.deleteOne({ _id: id }).exec();
    }

    async addItem(id: uuid, addItemDto: AddItemDto) {
        let items = (await this.getCartById(id)).items;
        items = items.concat(addItemDto.items);
        
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
        let items = cart.items; 

        for(var updateItem of updateItemDto.items) {
            let index = items.findIndex(element => element.referencedId === updateItem.referencedId)
            items[index] = updateItem;
        }

        return this.cartModel.updateOne({ _id: id }, { items: items }).exec();
    }

    async deleteItem(id: uuid, deleteItemDto: DeleteItemDto) : Promise<Cart> {
        let items = (await this.getCartById(id)).items;
        items = items.filter(item => !(deleteItemDto.ids.indexOf(item.referencedId) > -1));
        
        console.log(items);

        return this.cartModel.updateOne({ _id: id }, { items: items }).exec();
    }
}
