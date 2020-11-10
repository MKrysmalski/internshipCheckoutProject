import { application, response } from 'express';
import { Injectable, Body } from '@nestjs/common';
import axios,{AxiosPromise,AxiosRequestConfig}from 'axios';
var querystring=require('querystring');
@Injectable()
export class PaypalService {

    private userId: string;
    private userSecret: string;

    private token: string;
    private expiresAt: number;

    constructor() {
        this.userId = 'AemEOmrQ0RWuCoVFsyhi_8MB7aWR8mbc5USRgKi0p7VXJHJ-IXhkoFFhvM5onE-bKGsvEHNRSeLxX1Ad';
        this.userSecret = 'ECx-if7e0OGjv-P9tmGWHghCab5je4c1FoMCvA1aiQWYcTUbuVP4PkRTlvQ9GB0ZysRxz7uuDT9NB-0O';

        this.createBearer();
    }

    private async createBearer(){//get bearer token
        let response = null;
        try {
            response = await axios({
                url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
                method: 'POST',
                withCredentials: true,
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': '*',
                },
                auth: {
                    username: this.userId,
                    password: this.userSecret
                },  
                params: { 
                    'grant_type': 'client_credentials'    
                }
            });
        } catch(error) {
            console.log(error);
        }

        this.token = `${response.data.token_type} ${response.data.access_token}`;
        this.expiresAt = Math.round(+new Date() / 1000) + response.data.expires_in - 60;
    }

    private tokenExpired() : boolean {
        return this.expiresAt <= Math.round(+new Date() / 1000) ? true : false;
    }

    async orderDetails(id:string){
        
        let response=await axios({
            method:'GET',
            url:'https://api.sandbox.paypal.com/v2/checkout/orders/'+id,
            headers:{
                'Content-Type' : 'application/json',
                'Authorization' : this.token
            }
        })
        return response.data
    }
    
    async createOrder(userId:string, userSecret:string){
        let response=null;
        if(this.tokenExpired()) {
            this.createBearer();
        }
        try{
            response=await axios({
            method: 'POST',
            url: 'https://api.sandbox.paypal.com/v2/checkout/orders',
            headers:{
                'Authorization':this.token,
                'Content-Type':'application/json',
                },
                data: {
                    'intent':'AUTHORIZE',
                    'payer': {
                        'name':{
                            'given_name':'John',
                            'surname':'Doe'
                        },
                        'email':'example@example.com',
                        'birth_date':'1999-02-25',
                        'country_code': 'DE'
                    },
                    'purchase_units':[{
                        'amount':{
                            'currency_code':'EUR',
                            'value':'1.00'
                        },
                        'payee':{
                            'email_address':'sb-47ofa473674765@business.example.com',
                        },
                        'description':'This is a description!'
                    }],
                    "application_context":{
                        brand_name:"exampleBrand",
                        locale:"de-DE",
                        landing_page:"NO_PREFERENCE",
                        shipping_preference:"NO_SHIPPING",
                        user_action:"PAY_NOW",
                        return_url:"https://www.google.com",
                        cancel_url:"https://www.google.com",
                    },
                },    
            })
        }catch(error){
            console.log(error);
        }
        console.log(response);
        return response.data.links[3].href
    } 
}


