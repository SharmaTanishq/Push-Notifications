import { KiboClient } from './KiboClient';

export class Customers {
    private client = KiboClient.getInstance();
    private headers = KiboClient.getDefaultHeaders();

    async getCustomer(customerId: string) {
        try {
            const response = await this.client.commerce.customer.getCustomer({
                customerId,
                headers: this.headers
            });
            return response;
        } catch (error) {
            console.error('Error fetching customer:', error);
            throw error;
        }
    }

    async getCustomers(startIndex: number = 0, pageSize: number = 20) {
        try {
            const response = await this.client.commerce.customer.getCustomers({
                startIndex,
                pageSize,
                headers: this.headers
            });
            return response;
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    }

    async updateCustomer(customerId: string, customerData: any) {
        try {
            const response = await this.client.commerce.customer.updateCustomer({
                customerId,
                customerAccountAndAuthInfo: customerData,
                headers: this.headers
            });
            return response;
        } catch (error) {
            console.error('Error updating customer:', error);
            throw error;
        }
    }

    async getCustomerAttributes(customerId: string) {
        try {
            const response = await this.client.commerce.customer.getCustomerAttributes({
                customerId,
                headers: this.headers
            });
            return response;
        } catch (error) {
            console.error('Error fetching customer attributes:', error);
            throw error;
        }
    }
} 