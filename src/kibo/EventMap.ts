import { COMPLETED, DIGITAL_GIFT_CARD_SKU_ID, ITEM_PICKUP, ORDER_FULFILLED, ORDER_OPENED, READY_FOR_PICKUP, SHIPMENT_WORKFLOW_STATUS_CHANGED } from "./constants";
import { Customers } from "./Customers";
import { Orders } from "./Orders";
import { getShipmentDetailsById } from "./Shipments";

export const EVENTS_MAPPED = [
    {
        status: 'order.opened',
    },
    {
        status: 'order.cancelled',
    },
    {
        status: 'order.fulfilled',
    }
]

interface Event {
    eventId: string;
    extendedProperties?: ExtendedProperties[];
    topic: string;
    entityId: any;
    timestamp: string;
    correlationId: string;
    isTest: boolean;
}

interface ExtendedProperties {
    key: string,
    value: string
}

function mergeCancelledItems(cancelArray: any, fullArray: any) {
    return cancelArray.map((cancelItem: any) => {
        const match = fullArray.find((fullItem: any) =>
            fullItem.product.productCode === cancelItem.productCode &&
            fullItem.product.variationProductCode === cancelItem.variationProductCode &&
            fullItem.product.upc === cancelItem.upc
        );

        if (match) {
            // Clone the match to avoid mutating original array
            const mergedItem = { ...match };
            mergedItem.quantity = cancelItem.quantity;
            return mergedItem;
        }

        // Optionally return null or skip if no match
        return null;
    }).filter((item: any) => item !== null); // Remove unmatched items
}

export const sendNotification = async (event: Event) => {

    const Order = new Orders();
    const Customer = new Customers();
    let isGiftCard = false
    let orderId = event.entityId || "";

    let isReadyForPickup = false;
    let isCompleted = false;
    let isBOPIS = false;

    if (event.extendedProperties) {
        orderId = event.extendedProperties.find(property => property.key === 'orderId')?.value || "";
        isReadyForPickup = !!event.extendedProperties.find(property => property.key === 'newState' && property.value === READY_FOR_PICKUP);
        isCompleted = !!event.extendedProperties.find(property => property.key === 'newState' && property.value === COMPLETED);
    }
    if (!orderId) {
        return null;
    }
    const orderDetails = await Order.getOrder(orderId);

    if (event.topic === SHIPMENT_WORKFLOW_STATUS_CHANGED) {
        await getShipmentDetailsById(event.entityId).then(response => {
            isBOPIS = response?.shipmentType === "BOPIS";
            isGiftCard = response?.items?.some((item: any) => item?.variationProductCode == DIGITAL_GIFT_CARD_SKU_ID)
            console.log("isGiftCard", isGiftCard)
            const updatedArray = mergeCancelledItems(response?.items, orderDetails.items);
            updatedArray?.filter((item: any) => {
                if (item?.data?.['egifter-data']?.isPromotional === true) {
                    isGiftCard = true
                }
            });
        })
    }

    if (isGiftCard) {
        return
    }

    const customerAccountId = orderDetails.customerAccountId;
    const customer = await Customer.getCustomer(customerAccountId!);

    const getdeviceId = () => {
        const deviceObjOrder: any = orderDetails?.attributes?.find(item => item.fullyQualifiedName?.toLowerCase() === ('Tenant~DeviceAppToken').toLowerCase());
        if (deviceObjOrder) {
            return deviceObjOrder?.values[0]
        } else {
            const deviceObjCustomer: any = customer?.attributes?.find(item => item.fullyQualifiedName?.toLowerCase() === ('Tenant~deviceapptoken').toLowerCase());
            if (deviceObjCustomer) {
                return deviceObjCustomer?.values[0]
            } else {
                return null
            }
        }
    }


    const deviceId = getdeviceId()
    // const deviceId = "efKYwO_mRj-2OCr670kGE8:APA91bFG09OQu39B0-CVnqI9U_XjxWnVrZeXlQC6aCHN8VWd5I6-YrlCrTUgj-iKJiiBZM4_lryemP5gIhqsvvL6HInRpTXakCreksPxIeMTvwWo_q6qY-8"

    console.log(deviceId, ": Device Id")

    const customerFirstName = customer.firstName;


    if (!deviceId) {
        return null;
    }

    switch (event.topic) {

        // case ORDER_OPENED:
        //     if (isBOPIS) {
        //         return {
        //             title: "We've received your order",
        //             body: `Fleet Farm order ${orderDetails.externalId || orderDetails.orderNumber} has been received. Don't head to the store just yet! You'll receive another notification when your order is ready for pickup.`,
        //             token: deviceId,
        //             profileId: customerAccountId,
        //             orderId: orderDetails.externalId || orderDetails.orderNumber
        //         }
        //     }
        //     return {
        //         title: "We've received your order",
        //         body: `Fleet Farm order ${orderDetails.externalId || orderDetails.orderNumber} has been received. You'll receive another notification when your order ships.`,
        //         token: deviceId,
        //         profileId: customerAccountId,
        //         orderId: orderDetails.externalId || orderDetails.orderNumber
        //     }

        case SHIPMENT_WORKFLOW_STATUS_CHANGED:
            if (isReadyForPickup) {
                return {
                    title: "Your Fleet Farm order is ready for pick up!",
                    body: `Fleet Farm order ${orderDetails.externalId || orderDetails.orderNumber} is ready for pick up! See you soon, ${customerFirstName}.`,
                    token: deviceId,
                    profileId: customerAccountId,
                    orderId: orderDetails.externalId || orderDetails.orderNumber
                }
            }
            if (isBOPIS && isCompleted) {
                return {
                    title: "Thanks for picking up your order!",
                    body: `Fleet Farm order ${orderDetails.externalId || orderDetails.orderNumber} has been picked up. Thank you for shopping with Fleet Farm, ${customerFirstName}.`,
                    token: deviceId,
                    profileId: customerAccountId,
                    orderId: orderDetails.externalId || orderDetails.orderNumber
                }
            }
            if (!isBOPIS && isCompleted) {
                return {
                    title: "Your Fleet Farm order has shipped!",
                    body: `Fleet Farm order ${orderDetails.externalId || orderDetails.orderNumber} has shipped! Thank you for shopping with Fleet Farm, ${customerFirstName}.`,
                    token: deviceId,
                    profileId: customerAccountId,
                    orderId: orderDetails.externalId || orderDetails.orderNumber
                }
            }
        default:
            return null;
    }

}
