import { KiboClient } from './KiboClient';
import { OrderApi } from '@kibocommerce/rest-sdk/clients/Commerce';


const client = new OrderApi(KiboClient);
export class Orders {
    

    async getOrder(orderId: string) {
        try {
            const response = await client.getOrder({
                orderId,               
            });
            return response;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    }

} 