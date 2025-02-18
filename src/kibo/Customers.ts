import { KiboClient } from './KiboClient';

import { CustomerAccountApi } from '@kibocommerce/rest-sdk/clients/Customer/apis/CustomerAccountApi';

const client = new CustomerAccountApi(KiboClient);

export class Customers {
    
    

    async getCustomer(customerId: number) {
        try {
            const response = await client.getAccount({                
                accountId: customerId
               
            });
            return response;
        } catch (error) {
            console.error('Error fetching customer:', error);
            throw error;
        }
    }

    
} 