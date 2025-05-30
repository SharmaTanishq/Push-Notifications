import logger from '../logger';
import { KiboClient } from './KiboClient';
import { ShipmentApi } from "@kibocommerce/rest-sdk/clients/Fulfillment";


const shipmentClient = new ShipmentApi(KiboClient);
export const getShipmentDetailsById = async (
  shipmentNumber: number,
) => {
  const response = await shipmentClient.getShipment({
    shipmentNumber: shipmentNumber,
  }).catch(error => {
    logger.error("Error Fetching Shipment Details", error.apiError);
    return error.message;
  })
  return response;
};

export const getBopisShipments = async () => {
  // const response = await orderClient.getOrders({
  //   filter: "attributes.name%20eq%20Tenant~bopisOrder%20and%20attributes.value%20eq%20true and ",    
  // })
  const today = new Date();

  // const yesterday = new Date(today);
  // yesterday.setDate(today.getDate() - 1);

  // const dayBeforeYesterday = new Date(today);
  // dayBeforeYesterday.setDate(today.getDate() - 2);

  // const yesterdayFormatted = yesterday.toISOString().split('T')[0] + 'T23:59:59.999Z';

  // const dayBeforeYesterdayFormatted = dayBeforeYesterday.toISOString().split('T')[0] + 'T23:59:59.999Z';
  // // Format the date to ISO string format for the filter
  // // Example of one day ago in ISO format: "2023-11-15T14:30:00.000Z"
  // const filter = `shipmentType == BOPIS and readyForPickup =eq= true and readyForPickupDate =ge= ${dayBeforeYesterdayFormatted} and readyForPickupDate =le= ${yesterdayFormatted}`


  //*//////////////////////////////////////////////////////////////
  //* This should be removed after testing
  const twoHoursAgo = new Date(today.getTime() - (2 * 60 * 60 * 1000));
  const startTime = twoHoursAgo.toISOString();
  const endTime = today.toISOString();

  const filter = `shipmentType == BOPIS and readyForPickup =eq= true and readyForPickupDate =ge= ${startTime} and readyForPickupDate =le= ${endTime}`;
  //*//////////////////////////////////////////////////////////////

  
  const shipmentResponse = await shipmentClient.getShipments({ filter: filter,sort:"-shipmentNumber" }).catch(error => {
    logger.error("Error Fetching Shipment Details", error);
    return error?.message;
  })

  if (shipmentResponse?._embedded?.shipments?.length > 0) {
    return shipmentResponse?._embedded?.shipments;
  }
  return [];
}

export const getBopisShipments5Days = async () => {
  // Calculate one day ago
  const today = new Date();

  // const fiveDaysAgo = new Date(today);
  // fiveDaysAgo.setDate(today.getDate() - 5);

  // const sixDaysAgo = new Date(today);
  // sixDaysAgo.setDate(today.getDate() - 6);

  // const fiveDaysAgoFormatted =
  //   fiveDaysAgo.toISOString().split("T")[0] + "T23:59:59.999Z";

  // const sixDaysAgoFormatted =
  //   sixDaysAgo.toISOString().split("T")[0] + "T23:59:59.999Z";
  // // Format the date to ISO string format for the filter


  //   //
  // const filter = `shipmentType == BOPIS and readyForPickup =eq= true and readyForPickupDate =ge= ${sixDaysAgoFormatted} and readyForPickupDate =le= ${fiveDaysAgoFormatted}`;

  //*//////////////////////////////////////////////////////////////
  //* This should be removed after testing
  const twoHoursAgo = new Date(today.getTime() - (4 * 60 * 60 * 1000));
  const startTime = twoHoursAgo.toISOString();
  const endTime = today.toISOString();

  const filter = `shipmentType == BOPIS and readyForPickup =eq= true and readyForPickupDate =ge= ${startTime} and readyForPickupDate =le= ${endTime}`;
  
  //*//////////////////////////////////////////////////////////////

  const shipmentResponse = await shipmentClient.getShipments({ filter: filter,sort:"-shipmentNumber" }).catch(error => {
    console.log("Error Fetching Shipment Details", error);
    return error?.message;
  })


  if (shipmentResponse?._embedded?.shipments?.length > 0) {
    return shipmentResponse?._embedded?.shipments;
  }
  return [];
}
