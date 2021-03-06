import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';
import { Cart, CartDocument } from 'src/checkout/cart.schema';
import { CartService } from './cart.service';
import { Item } from 'src/checkout/types/item.type';
import { createMock } from '@golevelup/nestjs-testing';
import { v4 as uuid } from 'uuid';

const date = new Date(500000000000);

const mockCart:(
_id:string,
userId:uuid,
items: Item[],
createdAt:Date,
updatedAt:Date

) => Cart = (
_id = '1209fef5-e7f9-4375-ba03-e36e1d6d942b',
userId = '81a02834-7528-4242-bfbc-cb3c6f2b8cf7',
items = [{referencedId:"b3e57bfe-9def-47f7-a009-d76ec34c1faf",quantity:4}],
createdAt = date,
updatedAt = date,

) => {
    return {
        _id,userId,items,createdAt,updatedAt
    }
}

const mockCartDoc: (mock?: {
    _id:string;
    userId:uuid,
    items:Item[],
    createdAt:Date,
    updatedAt:Date
}) => Partial<CartDocument> = (mock?:{
    _id: string;
    userId: uuid;
    items: Item[];
    createdAt: Date;
    updatedAt: Date;
}) => {
    return {
        _id: (mock && mock._id) || '1209fef5-e7f9-4375-ba03-e36e1d6d942b',
        userId: (mock && mock.userId) || '81a02834-7528-4242-bfbc-cb3c6f2b8cf7',
        items: (mock && mock.items) || [{referencedId:"b3e57bfe-9def-47f7-a009-d76ec34c1faf",quantity:4}],
        createdAt: (mock && mock.createdAt) || date,
        updatedAt: (mock && mock.updatedAt) || date, 
    }
}

describe('CartService', () => {

    let service:CartService;
    let model: Model<CartDocument>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CartService,
                {
                    provide: getModelToken('Cart'),
                    useValue: {
                        new: jest.fn().mockResolvedValue(mockCart),
                         findById: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        updateOne: jest.fn(),
                        exec:jest.fn(),
                        create: jest.fn(),
                        deleteOne: jest.fn(),
                        addItem: jest.fn(),
                        getCartById: jest.fn(),
                        findByIdAndUpdate: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<CartService>(CartService);
        model = module.get<Model<CartDocument,CartDocument>>(getModelToken('Cart'));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(model).toBeDefined();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('create a Cart', async () => {//
        jest.spyOn(service,'create').mockReturnValue({
            id: "1209fef5-e7f9-4375-ba03-e36e1d6d942b",
            userId: "1209fef5-e7f9-4375-ba03-e36e1d6d942b"
        } as any)
        expect(await service.create({id:"1209fef5-e7f9-4375-ba03-e36e1d6d942b"}))
        .toEqual({
            id: "1209fef5-e7f9-4375-ba03-e36e1d6d942b",
            userId: "1209fef5-e7f9-4375-ba03-e36e1d6d942b"
        })   
    });

    it('should return cart by id', async () => {
        jest.spyOn(model,'findById').mockReturnValue(
            mockCartDoc({
                _id: '1209fef5-e7f9-4375-ba03-e36e1d6d942b',
                userId: '81a02834-7528-4242-bfbc-cb3c6f2b8cf7', 
                items: [{referencedId:'b3e57bfe-9def-47f7-a009-d76ec34c1faf',quantity:4}],
                createdAt: date, 
                updatedAt: date
            }) as any
        );
        const findMockCart = mockCart('1209fef5-e7f9-4375-ba03-e36e1d6d942b','81a02834-7528-4242-bfbc-cb3c6f2b8cf7',[{referencedId:'b3e57bfe-9def-47f7-a009-d76ec34c1faf',quantity:4}],date,date);
        const foundCart = await service.getCartById('1209fef5-e7f9-4375-ba03-e36e1d6d942b');

        expect(foundCart).toEqual(findMockCart);

    });

    it('should return cart by userId', async () => {
        jest.spyOn(model,'findOne').mockReturnValue(
            mockCartDoc({
                _id: '1209fef5-e7f9-4375-ba03-e36e1d6d942b',
                userId: '81a02834-7528-4242-bfbc-cb3c6f2b8cf7', 
                items: [{referencedId:'b3e57bfe-9def-47f7-a009-d76ec34c1faf',quantity:4}],
                createdAt: date, 
                updatedAt: date
            }) as any 
        )
        const findMockCart = mockCart('1209fef5-e7f9-4375-ba03-e36e1d6d942b','81a02834-7528-4242-bfbc-cb3c6f2b8cf7',[{referencedId:'b3e57bfe-9def-47f7-a009-d76ec34c1faf',quantity:4}],date,date);
        const foundCart = await service.getCartByUserId('81a02834-7528-4242-bfbc-cb3c6f2b8cf7');
        expect(foundCart).toEqual(findMockCart);
    });

    it('should set User to Cart', async () => {
        jest.spyOn(model,'findByIdAndUpdate').mockReturnValue(
            {"_id": "1209fef5-e7f9-4375-ba03-e36e1d6d942b", "createdAt": date, "items": [{"quantity": 4, "referencedId": "b3e57bfe-9def-47f7-a009-d76ec34c1faf"}], "updatedAt": date, "userId": "81a02834-7528-4242-bfbc-cb3c6f2b8cf7"} as any
        )
        expect(await service.setUserToCart('1209fef5-e7f9-4375-ba03-e36e1d6d942b','81a02834-7528-4242-bfbc-cb3c6f2b8cf7')).toEqual({"_id": "1209fef5-e7f9-4375-ba03-e36e1d6d942b", "createdAt": date, "items": [{"quantity": 4, "referencedId": "b3e57bfe-9def-47f7-a009-d76ec34c1faf"}], "updatedAt": date, "userId": "81a02834-7528-4242-bfbc-cb3c6f2b8cf7"});
    });

    it('delete Cart', async ()=> {
        jest.spyOn(model,"deleteOne").mockReturnValue(
            { } as any
        )
        service.delete("45b14e4b-004a-4388-99bf-6cbe95596617");
        expect(model.deleteOne).toHaveBeenCalled();
    });

    it('add Item to Cart', async () => {
        jest.spyOn(service,'getCartById').mockReturnValue(mockCart('1209fef5-e7f9-4375-ba03-e36e1d6d942b','81a02834-7528-4242-bfbc-cb3c6f2b8cf7',[{referencedId:"b3e57bfe-9def-47f7-a009-d76ec34c1faf",quantity:2}],date,date) as any);
        jest.spyOn(model,'updateOne').mockReturnValue(
            mockCartDoc({
                _id: '1209fef5-e7f9-4375-ba03-e36e1d6d942b',
                userId: '81a02834-7528-4242-bfbc-cb3c6f2b8cf7', 
                items: [{referencedId:'b3e57bfe-9def-47f7-a009-d76ec34c1faf',quantity:4}],
                createdAt: date, 
                updatedAt: date
            }) as any  
        )
        const result = await service.addItem('1209fef5-e7f9-4375-ba03-e36e1d6d942b', {id:'1209fef5-e7f9-4375-ba03-e36e1d6d942b',items:[{referencedId:"b3e57bfe-9def-47f7-a009-d76ec34c1faf",quantity:2}]})
        expect(result).toEqual({
            _id: '1209fef5-e7f9-4375-ba03-e36e1d6d942b',
            userId: '81a02834-7528-4242-bfbc-cb3c6f2b8cf7', 
            items: [{referencedId:'b3e57bfe-9def-47f7-a009-d76ec34c1faf',quantity:4}],
            createdAt: date, 
            updatedAt: date
        });

    });

    it('update Item', async () => {
        jest.spyOn(service,'getCartById').mockReturnValue(mockCart('1209fef5-e7f9-4375-ba03-e36e1d6d942b','1209fef5-e7f9-4375-ba03-e36e1d6d942b',[{referencedId:"1209fef5-e7f9-4375-ba03-e36e1d6d942b",quantity:4}],date,date) as any)
        jest.spyOn(model,'updateOne').mockReturnValue(
            createMock<Query<CartDocument>>({
                exec: jest
                .fn()
                .mockResolvedValue(
                    mockCartDoc({
                        _id: '1209fef5-e7f9-4375-ba03-e36e1d6d942b',
                        userId: '81a02834-7528-4242-bfbc-cb3c6f2b8cf7', 
                        items: [{referencedId:'b3e57bfe-9def-47f7-a009-d76ec34c1faf',quantity:4}],
                        createdAt: date, 
                        updatedAt: date
                    })
                )
            })
        )
        const result = await service.updateItem(
                '1209fef5-e7f9-4375-ba03-e36e1d6d942b', 
                { 
                items: [{ referencedId:'1209fef5-e7f9-4375-ba03-e36e1d6d942b', quantity: 4 }],
                id:'1209fef5-e7f9-4375-ba03-e36e1d6d942b'
                }
            );
        expect(result).toEqual({
            _id: '1209fef5-e7f9-4375-ba03-e36e1d6d942b',
            userId: '81a02834-7528-4242-bfbc-cb3c6f2b8cf7', 
            items: [{referencedId:'b3e57bfe-9def-47f7-a009-d76ec34c1faf',quantity:4}],
            createdAt: date, 
            updatedAt: date
        });
    });

    it('delete Item', async () => {
        jest.spyOn(service,'getCartById').mockResolvedValue({
            _id: '1209fef5-e7f9-4375-ba03-e36e1d6d942b',
            userId: '81a02834-7528-4242-bfbc-cb3c6f2b8cf7', 
            items: [{referencedId:'b3e57bfe-9def-47f7-a009-d76ec34c1faf',quantity:4}],
            createdAt: date, 
            updatedAt: date
        } as any)
        jest.spyOn(model,'updateOne').mockReturnValue(
            createMock<Query<CartDocument>>({
                exec: jest
                .fn()
                .mockResolvedValue(
                    mockCartDoc({
                        _id: '1209fef5-e7f9-4375-ba03-e36e1d6d942b',
                        userId: '81a02834-7528-4242-bfbc-cb3c6f2b8cf7', 
                        items: [],
                        createdAt: date, 
                        updatedAt: date
                    })
                )                
            })
        )
        const result = await service.deleteItem('1209fef5-e7f9-4375-ba03-e36e1d6d942b',{ids:['b3e57bfe-9def-47f7-a009-d76ec34c1faf'],id:'1209fef5-e7f9-4375-ba03-e36e1d6d942b'})
        const awaitedResult = {
            _id: '1209fef5-e7f9-4375-ba03-e36e1d6d942b',
            userId: '81a02834-7528-4242-bfbc-cb3c6f2b8cf7', 
            items: [],
            createdAt: date, 
            updatedAt: date
        }
        expect(result).toEqual(awaitedResult);
    })
});