/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { UserId, AddItem } from './../grpc/grpc.interface';
import { Body, Controller, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { DeleteItemDto } from './dto/delete-item.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { CartId } from '../grpc/grpc.interface';
@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) { }

    @GrpcMethod('AppController', 'CreateCart')
    createCart(@Body(ValidationPipe) createCartDto: CreateCartDto ) {
        return this.cartService.create(createCartDto);
    }

    @GrpcMethod('AppController', 'GetCartByUser')
    getCartByUser(userId: UserId) {
        return this.cartService.getCartByUserId(userId.id);
    }

    @GrpcMethod('AppController', 'GetCartById')
    getCartById(cardId: CartId) {
        return this.cartService.getCartById(cardId.id);
    }

    @GrpcMethod('AppController', 'DeleteCartById')
    deleteCart(cartid: CartId) {
        this.cartService.delete(cartid.id);
        return {};
    }

    @GrpcMethod('AppController','AddItem')
    addItem(addItem:AddItem) {
        return this.cartService.addItem(addItem.id, addItem);
    }

    @GrpcMethod('AppController','UpdateItem')
    updateItem(updateItemDto:UpdateItemDto) {
        this.cartService.updateItem(updateItemDto.id, updateItemDto);
    }

    @GrpcMethod('AppController','DeleteItem')
    deleteItem(deleteItemDto: DeleteItemDto) {
        console.log(deleteItemDto);
        return this.cartService.deleteItem(deleteItemDto.id, deleteItemDto);
    }
}
