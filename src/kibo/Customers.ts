import { KiboClient } from './KiboClient';

import { CustomerAccountApi } from '@kibocommerce/rest-sdk/clients/Customer/apis/CustomerAccountApi';
import logger from '../logger';
const client = new CustomerAccountApi(KiboClient);

export class Customers {
    
    

    async getCustomer(customerId: number) {
        try {
            const response = await client.getAccount({                
                accountId: customerId
               
            });
            return response;
        } catch (error) {
            logger.error('Error fetching customer:', error);
            throw error;
        }
    }

    
} 