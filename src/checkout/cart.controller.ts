import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { DeleteItemDto } from './dto/delete-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) { }

    @Post()
    createCart() {
        return this.cartService.create();
    }

    @Get('/:id')
    getCart(
        @Param('id', ParseUUIDPipe)
        id: string
    ) {
        return this.cartService.getByCartId(id)
    }

    @Delete('/:id')
    deleteCart(
        @Param('id', ParseUUIDPipe)
        id: string
    ) {
        this.cartService.delete(id);
    }

    @Post('/:id/item')
    addItem(
        @Param('id', ParseUUIDPipe)
        id: string,
        @Body(ValidationPipe)
        addItemDto: AddItemDto
    ) {
        return this.cartService.addItem(id, addItemDto);
    }

    @Patch(':id/item')
    updateItem(
        @Param('id', ParseUUIDPipe)
        id: string,
        @Body(ValidationPipe)
        updateItemDto: UpdateItemDto
    ) {
        this.cartService.updateItem(id, updateItemDto);
    }

    @Delete('/:id/item')
    deleteItem(
        @Param('id', ParseUUIDPipe)
        id: string,
        @Body(ValidationPipe)
        deleteItemDto: DeleteItemDto
    ) {
        this.cartService.deleteItem(id, deleteItemDto);
    }
}
