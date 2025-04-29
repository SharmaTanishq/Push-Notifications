import schedule from "node-schedule";
import { getBopisShipments, getBopisShipments5Days } from "../kibo/Shipments";

import { sendNotification } from "./sendNotifications";

export const initializeScheduler = async () => {
  // Schedule job to run every 4 hours
  const job = schedule.scheduleJob(process.env.REMINDER_TIME!, async () => {
    try {
      console.log("Running BOPIS shipment check:", new Date().toISOString());

      const response = (await getBopisShipments()) as any;

      // Create a set to track processed order IDs to avoid duplicates
      const processedOrderIds = new Set<string>();

      // Add each shipment's orderId to the set
      if (response && response.length > 0) {
        for (const shipment of response) {
          if (shipment.orderId) {
            processedOrderIds.add(shipment.orderId);
          }
        }
        console.log(
          `Found ${processedOrderIds.size} unique BOPIS orders to process`
        );
      }

      if (response && response.length > 0) {
        // Process each shipment sequentially using for...of loop
        for (const orderId of processedOrderIds) {
          try {
            await sendNotification(orderId, false).catch((error) => {
              console.error(`Error sending reminder Notification: ${error}`);
            });
            // console.log('Notifications sent:', response);
          } catch (error) {
            console.error(`Error processing shipment ${orderId}:`, error);
          }
        }
      } else {
        console.log("No BOPIS shipments found or invalid response structure");
      }
    } catch (error) {
      console.error("Error in BOPIS shipment scheduler:", error);
    }
  });

  const job5Days = schedule.scheduleJob(
    process.env.REMINDER_TIME!,
    async () => {
      try {
        console.log("Running BOPIS shipment check:", new Date().toISOString());

        const response = (await getBopisShipments5Days()) as any;

        // Create a set to track processed order IDs to avoid duplicates
        const processedOrderIds = new Set<string>();

        // Add each shipment's orderId to the set
        if (response && response.length > 0) {
          for (const shipment of response) {
            if (shipment.orderId) {
              processedOrderIds.add(shipment.orderId);
            }
          }
          console.log(
            `Found ${processedOrderIds.size} unique BOPIS orders to process`
          );
        }

        if (response && response.length > 0) {
          // Process each shipment sequentially using for...of loop
          for (const orderId of processedOrderIds) {
            try {
              await sendNotification(orderId, true).catch((error) => {
                console.error(`Error sending reminder Notification: ${error}`);
              });
              // console.log('Notification sent:', response);
            } catch (error) {
              console.error(`Error processing shipment ${orderId}:`, error);
            }
          }
        } else {
          console.log("No BOPIS shipments found or invalid response structure");
        }
      } catch (error) {
        console.error("Error in BOPIS shipment scheduler:", error);
      }
    }
  );

  // Run immediately on startup
  job?.invoke();
  job5Days?.invoke();
};
