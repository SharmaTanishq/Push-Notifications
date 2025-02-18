import { ITEM_PICKUP, ORDER_FULFILLED, ORDER_OPENED, READY_FOR_PICKUP, SHIPMENT_WORKFLOW_STATUS_CHANGED } from "./constants";
import { Customers } from "./Customers";
import { Orders } from "./Orders";

export const EVENTS_MAPPED = [
    {
        status:'order.opened',        
    },
    {
        status:'order.cancelled',        
    },
    {
        status:'order.fulfilled',        
    }
    
    

]

interface Event {
    eventId: string;
    extendedProperties?: ExtendedProperties[];
    topic: string;
    entityId: string;
    timestamp: string;
    correlationId: string;
    isTest: boolean;
}

interface ExtendedProperties {
    key:string,
    value:string
}

export const sendNotification = async (event: Event) => {

    const Order = new Orders();
    const Customer = new Customers();

    let orderId = event.entityId || "";

    let isReadyForPickup = false;

    if(event.extendedProperties){
        orderId = event.extendedProperties.find(property => property.key === 'orderId')?.value || "";
        isReadyForPickup = event.extendedProperties.find(property => property.key === 'newState' && property.value === READY_FOR_PICKUP)? true : false;        
    }

    if(!orderId){
        return null;
    }
    
    const orderDetails = await Order.getOrder(orderId);
    const isBOPIS = orderDetails.items?.[0]?.fulfillmentMethod === ITEM_PICKUP
    const customerAccountId = orderDetails.customerAccountId;
    const customer = await Customer.getCustomer(customerAccountId!);
    const customerFirstName = customer.firstName;

    console.log(orderDetails.orderNumber, isBOPIS, customerFirstName);

    switch(event.topic){
        case ORDER_OPENED:      
            if (isBOPIS){
                return {
                    title: "We've received your order",
                    body: `Fleet Farm order ${orderDetails.orderNumber} has been received. Don't head to the store just yet! You'll receive another notification when your order is ready for pickup.`
                }
            }
            return {
                title: "We've received your order",
                body: `Fleet Farm order ${orderDetails.orderNumber} has been received. You'll receive another notification when your order ships.`
            }
        case ORDER_FULFILLED:
            if(isBOPIS){
                return {
                    title: "Thanks for picking up your order!",
                    body: `Fleet Farm order ${orderDetails.orderNumber} has been picked up. Thank you for shopping with Fleet Farm, ${customerFirstName}.`
                }
            }
            return {
                title: "Your Fleet Farm order has shipped!",
                body: `Fleet Farm order ${orderDetails.orderNumber} has shipped! Thank you for shopping with Fleet Farm, ${customerFirstName}.`
            }
        case SHIPMENT_WORKFLOW_STATUS_CHANGED:
            if(isReadyForPickup){
                return {
                    title: "Your Fleet Farm order is ready for pick up!",
                    body: `Fleet Farm order ${orderDetails.orderNumber} is ready for pick up! See you soon, ${customerFirstName}.`
                }
            }
       
        default:
            return null;
    }
}
