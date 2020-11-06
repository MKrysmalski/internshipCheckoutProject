import { Injectable } from '@nestjs/common';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { DeleteItemDto } from './dto/delete-item.dto';
import { Cart, CartDocument } from './cart.schema';
import { v4 as uuid } from 'uuid';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name)
        private cartModel: Model<CartDocument>
    ) {}

    create() {
        return new this.cartModel().save();
    }

    getByCartId(id: uuid) {
        return this.cartModel.findById(id).exec();
    }

    getByUserId(userId: uuid) : Promise<Cart> {
        return this.cartModel.findOne(userId).exec();
    }

    delete(id: uuid) {
        this.cartModel.remove(id);
    }

    async addItem(id: uuid, addItemDto: AddItemDto) {
        let cart = await this.getByCartId(id)
        
        cart.items.concat(addItemDto.items);
        
        //this.cartModel.update(cart);

        console.log(addItemDto)
        
        return cart.save();
    }

    async updateItem(id: uuid, updateItemDto: UpdateItemDto) {
        let cart = await this.getByCartId(id);
    }

    async deleteItem(id: uuid, deleteItemDto: DeleteItemDto) {
        let cart = await this.cartModel.findOne(id)
        cart.items = cart.items.filter(item => !(deleteItemDto.ids.indexOf(item.referencedId) > -1));
        return cart.save()
    }
}
