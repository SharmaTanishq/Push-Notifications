import { KiboClient } from './KiboClient';
import { ShipmentApi } from "@kibocommerce/rest-sdk/clients/Fulfillment";


const shipmentClient = new ShipmentApi(KiboClient);
export const getShipmentDetailsById = async (
  shipmentNumber: number,
) => {
  const response = await shipmentClient.getShipment({
    shipmentNumber: shipmentNumber,
  }).catch(error => {
    console.log("Error Fetching Shipment Details", error.apiError);
    return error.message;
  })
  return response;
};

export const getBopisShipments = async () => {
  // const response = await orderClient.getOrders({
  //   filter: "attributes.name%20eq%20Tenant~bopisOrder%20and%20attributes.value%20eq%20true and ",    
  // })
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
  // Calculate one day ago
  const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();
  // Format the date to ISO string format for the filter

  const filter = `shipmentType == BOPIS and workflowState.shipmentState == READY_FOR_PICKUP and auditInfo.updateDate =ge= ${oneDayAgo}`
  const shipmentResponse = await shipmentClient.getShipments({ request: { filter: filter } }).catch(error => {
    console.log("Error Fetching Shipment Details", error);
    return error?.message;
  })

  if (shipmentResponse?._embedded?.shipments?.length > 0) {
    return shipmentResponse?._embedded?.shipments;
  }
  return [];
}

export const getBopisShipments5Days = async () => {
  // const response = await orderClient.getOrders({
  //   filter: "attributes.name%20eq%20Tenant~bopisOrder%20and%20attributes.value%20eq%20true and ",    
  // })

  // Calculate one day ago
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
  // Format the date to ISO string format for the filter

  const filter = `shipmentType == BOPIS and workflowState.shipmentState == READY_FOR_PICKUP and auditInfo.updateDate =ge= ${fiveDaysAgo}`

  const shipmentResponse = await shipmentClient.getShipments({ request: { filter: filter } }).catch(error => {
    console.log("Error Fetching Shipment Details", error);
    return error?.message;
  })

  if (shipmentResponse?._embedded?.shipments?.length > 0) {
    return shipmentResponse?._embedded?.shipments;
  }
  return [];
}
