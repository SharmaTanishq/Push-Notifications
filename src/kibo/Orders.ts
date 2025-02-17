import { KiboClient } from './KiboClient';
import { OrderApi } from '@kibocommerce/rest-sdk/clients/Commerce';


const client = new OrderApi(KiboClient);
export class Orders {
    

    async getOrder(orderId: string) {
        try {
            const response = await this.client.commerce.orders.getOrder({
                orderId,
               
            });
            return response;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    }

    async getOrders(startIndex: number = 0, pageSize: number = 20) {
        try {
            const response = await this.client.commerce.orders.getOrders({
                startIndex,
                pageSize,
                headers: this.headers
            });
            return response;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }

    async updateOrderStatus(orderId: string, status: string) {
        try {
            const response = await this.client.commerce.orders.updateOrderStatus({
                orderId,
                status,
                headers: this.headers
            });
            return response;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }
} 