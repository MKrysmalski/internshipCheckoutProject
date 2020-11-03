import { Injectable } from '@nestjs/common';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { DeleteItemDto } from './dto/delete-item.dto';
import { Cart } from './cart.entity';
import { InjectModel } from "nestjs-typegoose";
import { v4 as uuid } from 'uuid';
import { ReturnModelType } from "@typegoose/typegoose";

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart) private cartModel: ReturnModelType<typeof Cart>
    ) {}

    create() : Promise<Cart> {
        return new this.cartModel().save();
    }

    getByCartId(id: uuid) : Promise<Cart> {
        return this.cartModel.findOne(id).exec();
    }

    getByUserId(userId: uuid) : Promise<Cart> {
        return this.cartModel.findOne(userId).exec();
    }

    delete(id: uuid) {
        this.cartModel.remove(id);
    }

    async addItem(id: uuid, addItemDto: AddItemDto) : Promise<Cart> {
        let cart = await this.cartModel.findOne(id)
        
        cart.items.concat(addItemDto.items);
        
        return cart.save();
    }

    async updateItem(id: uuid, updateItemDto: UpdateItemDto) {
        let cart = await this.cartModel.findOne(id);
    }

    async deleteItem(id: uuid, deleteItemDto: DeleteItemDto) {
        let cart = await this.cartModel.findOne(id)
        cart.items = cart.items.filter(item => !(deleteItemDto.ids.indexOf(item.referencedId) > -1));
        return cart.save()
    }
}
