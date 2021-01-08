import { OrderPaymentResponse } from './../order/order.payment.response';
import { BillingInformation } from './../order/types/billing-information.type';
import { ShippingInformation } from './../order/types/shipping-information.type';
import { Injectable, Body, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import axios,{ AxiosPromise,AxiosRequestConfig }from 'axios';
import { Logger } from '@nestjs/common';

@Injectable()
export class PaypalService {

    private logger = new Logger('paypalService');

    private userId: string;
    private userSecret: string;

    private token: string;
    private expiresAt: number;

    constructor() {
        
        this.userId = 'AemEOmrQ0RWuCoVFsyhi_8MB7aWR8mbc5USRgKi0p7VXJHJ-IXhkoFFhvM5onE-bKGsvEHNRSeLxX1Ad';
        this.userSecret = 'ECx-if7e0OGjv-P9tmGWHghCab5je4c1FoMCvA1aiQWYcTUbuVP4PkRTlvQ9GB0ZysRxz7uuDT9NB-0O';
        this.createBearer( this.userId, this.userSecret );
    }

    private async createBearer( userId:string, userSecret:string ) {
        
        let response = await axios({
            url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
            method: 'POST',
            withCredentials: true,
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
            },
            auth: {
                username: userId,
                password: userSecret
            },  
            params: { 
                'grant_type': 'client_credentials'    
            }
        });
        
        this.token = `${response.data.token_type} ${response.data.access_token}`;
        this.expiresAt = Math.round(+new Date() / 1000) + response.data.expires_in - 60;
        this.logger.verbose(`Bearertoken created for user: ${userId}. expires at ${this.expiresAt}`);
    }

    private tokenExpired() : boolean {
        return this.expiresAt <= Math.round(+new Date() / 1000) ? true : false;
    }

    async orderDetails(id: string) {
        try {
            let response=await axios({
                method: 'GET',
                url: 'https://api.sandbox.paypal.com/v2/checkout/orders/'+id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token
                }
            })
            return response.data;
        }
        
        catch(error) {
            this.logger.error(error.stack)
            throw error;
        }
    }
    
    async getBearer() {
        return this.token;
    }
    
    async createOrder( 
        userId: string,
        shippingInformation: ShippingInformation,
        billingInformation: BillingInformation,
        costs: number
    ):Promise<OrderPaymentResponse> {
        
        if(this.tokenExpired()) {
            this.createBearer(userId, this.userSecret);
        }
        
        let response = await axios({
            method: 'POST',
            url: 'https://api.sandbox.paypal.com/v2/checkout/orders',
            headers: {
                'Authorization': this.token,
                'Content-Type': 'application/json',
            },
            data: {
                'intent': 'CAPTURE',
                'payer': {
                    'name': {
                        'given_name': billingInformation.firstname,
                        'surname': billingInformation.lastname
                    },
                    'email': billingInformation.email,
                    'birth_date': billingInformation.birthday,
                    'country_code': billingInformation.countryCode,
                    'address_portable': {
                        'address_line_1': billingInformation.street,
                        'address_line_2': billingInformation.addressSuffix,
                        'admin_area_1': billingInformation.city,
                        'admin_area_2': billingInformation.country,
                        'posal_code': billingInformation.postalCode,
                        'country_code': billingInformation.countryCode
                    },
                },
                'purchase_units': [{
                    'amount': {
                        'currency_code': billingInformation.currencyCode,
                        'value': costs
                    },
                    'payee': {
                    'email_address': 'sb-47ofa473674765@business.example.com',
                    },
                    'description': 'This is a description!'
                }],
                "application_context": {                        
                    brand_name: billingInformation.billingBrandName,
                    locale: "de-DE",
                    landing_page: "NO_PREFERENCE",
                    shipping_preference: "NO_SHIPPING",
                    user_action: "PAY_NOW",
                    return_url: "https://www.google.com/?success=true",
                    cancel_url: "https://www.google.com/?success=false",
                },
            }    
        });
        const paymentId = response.data.id;
        
        return {
            authUrl: (response.data.links[1].href).toString(),
            paymentId:paymentId
        };
    }
}