
export class BillingInformation {
    constructor(
        public countryCode:string,
        public street: string,
        public city: string,
        public country:string,
        public postalCode: string,
        public company: string,
        public addressSuffix: string,
        public email:string,
        public title: string,
        public firstname: string,
        public lastname: string,
        public birthday:string,
        public currencyCode:string,
        public billingBrandName:string,
        public paymentMethod: string){}
}