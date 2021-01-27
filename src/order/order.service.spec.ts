import { MailerModule } from "@nestjs-modules/mailer";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MailConfig } from "./../../config/example.mailer.config";
import { Model, Query } from "mongoose";
import { MailService } from "./../mail/mail.service";
import { PaypalService } from "./../paypal/paypal.service";
import { PdfService } from "./../pdf/pdf.service";
import { OrderDocument } from "./order.schema";
import { OrderService } from "./order.service"
import { createMock } from "@golevelup/nestjs-testing";


const createOrder={
    email: "example@example.com",
    authorized: false,
    userId: "65f8f3e8-5817-4452-9dd8-7b562a85b88f",
    costs: 100,
    coupon: 0.2,
    items: [{ 
        referencedId: "65f8f3e8-5817-4452-9dd8-7b562a85b88a", 
        quantity: 2, 
        costs: 100 
    }],
    shippingStreet: "teststreet",
    shippingCity:"testCity",
    shippingPostalCode: "testPostaleCode",
    shippingCompany: "testCompany",
    shippingAddressSuffix: "testAddressSuffix",
    shippingGender: "mrs.",
    shippingFirstname: "testFirstname",
    shippingLastname: "testLastname",
    billingCountryCode: "De",
    billingStreet: "billingStreet",
    billingCity: "billingCity",
    billingCountry: "Germany",
    billingPostalCode: "testPostaleCode",
    billingCompany: "testCompany",
    billingAddressSuffix: "testAddressSuffix",
    billingEmail: "example@Example.com",
    billingTitle: "title",
    billingFirstname: "testFirstname",
    billingLastname: "testLastname",
    billingGender: "mrs.",
    billingBirthday: "1999-02-25",
    billingCurrencyCode: "EUR",
    billingBrandName: "wago",
    billingPaymentMethod: "paypal",
}
const createdOrder= {
    order: {
        _id: "c82f344a-4a6e-4d23-aae7-9e45e33b1d4b",
        userId: "65f8f3e8-5817-4452-9dd8-7b562a85b88f",
        orderId: "0b8f088b-c26a-44a0-8406-1544d242cbb9",
        email: "example@example.com",
        authorized: true,
        status: "WAIT FOR PAYPALAUTHENTICATION",
        costs: 200,
        items: [
            {
                "referencedId": "d0134be3-2c82-4dbc-a2f4-5e3571c894c5",
                "quantity": 20,
                "costs": 200
            }
        ],
        shippingInformation: {
            street: "teststreet",
            city: "testCity",
            postalCode: "testPostaleCode",
            company: "testCompany",
            addressSuffix: "testAddressSuffix",
            firstname: "testFirstname",
            lastname: "testLastname",
            gender: "mrs."
        },
        billingInformation: {
            countryCode: "De",
            street: "billingStreet",
            city: "billingCity",
            country: "Germany",
            postalCode: "billingPostalCode",
            company: "test",
            addressSuffix: "billingAddressSuffix",
            email: "example@Example.com",
            firstname: "billingFirstname",
            lastname: "billingLastname",
            birthday: "1999-02-25",
            currencyCode: "EUR",
            billingBrandName: "wago",
            paymentMethod: "paypal",
            gender: "mrs."
        },
        paymentId: "8WF231927G7112507",
        createdAt: "Thu Jan 21 2021 15:03:08 GMT+0100 (GMT+01:00)",
        updatedAt: "Thu Jan 21 2021 15:03:08 GMT+0100 (GMT+01:00)"
    },
    payment: "https://www.sandbox.paypal.com/checkoutnow?token=8WF231927G7112507"
}
const orderMock = {
    _id: "0384a8a4-691e-4d1b-a154-467da73ed6e6",
    userId: "65f8f3e8-5817-4452-9dd8-7b562a85b88f",
    orderId: "0db25cd6-fca1-47cf-abcd-85d6c894ee42",
    email: "example@example.com",
    authorized: true,
    status: "DONE",
    costs: 200,
    items: [
      {
        referencedId: "d0134be3-2c82-4dbc-a2f4-5e3571c894c5",
        quantity: 20,
        costs: 200
      }
    ],
    shippingInformation: {
      street: "teststreet",
      city: "testCity",
      postalCode: "testPostaleCode",
      company: "testCompany",
      addressSuffix: "testAddressSuffix",
      firstname: "testFirstname",
      lastname: "testLastname",
      gender: "mrs."
    },
    billingInformation: {
      countryCode: "De",
      street: "billingStreet",
      city: "billingCity",
      country: "Germany",
      postalCode: "billingPostalCode",
      company: "test",
      addressSuffix: "billingAddressSuffix",
      email: "example@Example.com",
      firstname: "billingFirstname",
      lastname: "billingLastname",
      birthday: "1999-02-25",
      currencyCode: "EUR",
      billingBrandName: "wago",
      paymentMethod: "paypal",
      gender: "mrs."
    },
    paymentId: "509050037K071021B",
    createdAt: "Fri Jan 22 2021 12:35:05 GMT+0100 (GMT+01:00)",
    updatedAt: "Fri Jan 22 2021 12:35:05 GMT+0100 (GMT+01:00)"
  }
  const handleCallbackMock= {
    _id: '0384a8a4-691e-4d1b-a154-467da73ed6e6',
    userId: '65f8f3e8-5817-4452-9dd8-7b562a85b88f',
    orderId: '0db25cd6-fca1-47cf-abcd-85d6c894ee42',
    email: 'example@example.com',
    authorized: true,
    status: 'PAYED',
    costs: 200,
    items: [
      {
        referencedId: 'd0134be3-2c82-4dbc-a2f4-5e3571c894c5',
        quantity: 20,
        costs: 200
      }
    ],
    shippingInformation: {
      street: 'teststreet',
      city: 'testCity',
      postalCode: 'testPostaleCode',
      company: 'testCompany',
      addressSuffix: 'testAddressSuffix',
      firstname: 'testFirstname',
      lastname: 'testLastname',
      gender: 'mrs.'
    },
    billingInformation: {
      countryCode: 'De',
      street: 'billingStreet',
      city: 'billingCity',
      country: 'Germany',
      postalCode: 'billingPostalCode',
      company: 'test',
      addressSuffix: 'billingAddressSuffix',
      email: 'example@Example.com',
      firstname: 'billingFirstname',
      lastname: 'billingLastname',
      birthday: '1999-02-25',
      currencyCode: 'EUR',
      billingBrandName: 'wago',
      paymentMethod: 'paypal',
      gender: 'mrs.'
    },
    paymentId: '509050037K071021B',
    createdAt: 'Fri Jan 22 2021 12:35:05 GMT+0100 (GMT+01:00)',
    updatedAt: 'Fri Jan 22 2021 12:35:05 GMT+0100 (GMT+01:00)',
    payerId: 'FBXWKDHHHTBLG'
  }


describe('OrderService', () => {
    let service:OrderService;
    let paypal:PaypalService;
    let pdf:PdfService;
    let mail:MailService;
    let model: Model<OrderDocument>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MailerModule.forRoot( {
                    transport: MailConfig.connection,
                    defaults: {
                        from: '"nest-modules" ping@7pkonzepte.de',
                    },
                }),
            ],
            providers:[OrderService,MailService,PdfService,PaypalService,
            {
                provide: getModelToken('Order'),
                useValue: {
                    createOrder: jest.fn(),
                    findOne: jest.fn(),
                    deleteOne: jest.fn(),
                    deleteMany: jest.fn(),
                    where: jest.fn(),
                    find: jest.fn(),
                    exec: jest.fn(),
                    getAllOrders: jest.fn(),
                    getOrderById:jest.fn(),
                    findOneAndUpdate: jest.fn(),
                    generatePdf:jest.fn(),
                    sendMail: jest.fn()
                }
            }],
        }).compile();

        pdf = await module.resolve(PdfService);
        mail = await module.resolve(MailService);
        paypal = await module.resolve(PaypalService);
        service = await module.resolve(OrderService);
        model =  module.get<Model<OrderDocument,OrderDocument>>(getModelToken('Order'));
        
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(paypal).toBeDefined();
        expect(pdf).toBeDefined();
        expect(mail).toBeDefined();
        expect(model).toBeDefined();
    });

    it('create a Order', async () => {//
        jest.spyOn(service,'createOrder').mockReturnValue(
            createdOrder as any);

        expect(service.createOrder(createOrder)).toEqual(createdOrder);
    });

    it('get Order by Id', async () => {
        jest.spyOn(model,'findOne').mockReturnValue(createdOrder as any);
        expect(await service.getOrderById("0b8f088b-c26a-44a0-8406-1544d242cbb9")).toEqual(createdOrder);
    })

    it('get user orders', async () => {   
        jest.spyOn(model,'find').mockReturnValue([createdOrder,createdOrder] as any);
        expect(await service.getUserOrders({id:"65f8f3e8-5817-4452-9dd8-7b562a85b88f"})).toEqual([createdOrder,createdOrder]);
    })

    it('get Order Authorization', async () => {
        jest.spyOn(service,'getOrderById').mockResolvedValue(
            orderMock as any
        )
        expect(await service.getOrderAuthorization("0db25cd6-fca1-47cf-abcd-85d6c894ee42")).toEqual(true);
    })

    it('update Order status', async () => {
        jest.spyOn(model,"findOneAndUpdate").mockReturnValue(
            orderMock as any
        )
        
        expect(await service.updateOrderStatus({orderId:"0db25cd6-fca1-47cf-abcd-85d6c894ee42", orderStatus:"DONE"})).toEqual(orderMock);
    })

    it('delete Order', async () => {
        jest.spyOn(model,"deleteOne").mockReturnValue(
            { } as any
        )
        service.deleteOrder("0db25cd6-fca1-47cf-abcd-85d6c894ee42");
        expect(model.deleteOne).toHaveBeenCalled();
    })

    it('delete user Orders', async () => {
        jest.spyOn(model,"deleteMany").mockReturnValue(
            { } as any
        )
        service.deleteUserOrders("");
        expect(model.deleteMany).toHaveBeenCalled();
    })

    it('get all Orders', async () => {
        jest.spyOn(model,"find").mockReturnValue(
            createdOrder as any
        )
        expect(await service.getAllOrders()).toEqual(createdOrder);
    })

    it('handle Callback', async () => {
        jest.spyOn(model,'findOneAndUpdate').mockReturnValue(
            handleCallbackMock as any
        )
        jest.spyOn(model,'findOneAndUpdate').mockReturnValue(
            handleCallbackMock as any
        )
        jest.spyOn(pdf,'generatePdf').mockReturnValue(
            {} as any
        )
        jest.spyOn(mail,'sendMail').mockResolvedValue(
            {} as any
        )
        expect(await service.handleCallback({success:true,token:"8HN89750P8549281C",PayerID:"FBXWKDHHHTBLG"})).toEqual(handleCallbackMock);
        expect(mail.sendMail).toHaveBeenCalled();
        expect(pdf.generatePdf).toHaveBeenCalled();
    })

    
})
