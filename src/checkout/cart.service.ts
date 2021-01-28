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

    async create(createCartDto: CreateCartDto): Promise<Cart> {
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
            return await this.cartModel.findById({_id:id});  
    }
    
    async getCartByUserId(userId: uuid) : Promise<Cart> {
        return await this.cartModel.findOne({ userId });
    }
    
    async setUserToCart(cartId: uuid, userId: uuid): Promise<Cart> {
        const result = await this.cartModel.findByIdAndUpdate({ _id: cartId }, { userId:userId });
        result.userId=userId;
        return result;
    }

    async delete(id: uuid): Promise<void> {
        try{
            await this.cartModel.deleteOne({ _id: id });
        }catch(error){
            console.log(error);
        }     
    }

    async addItem(id: uuid, addItem: AddItem): Promise<Cart> {
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

        const result =await this.cartModel.updateOne({ _id: id }, { items: Array.from(hashMap.values()) });
        result.items=Array.from(hashMap.values());
        return result;
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