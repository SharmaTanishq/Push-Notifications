import { messaging } from "../config/firebase";
import { Customers } from "../kibo/Customers";
import { Orders } from "../kibo/Orders";

export const sendNotification = async (orderId: string, is5Days: Boolean) => {
  const Order = new Orders();
  const Customer = new Customers();
  const orderDetails = await Order.getOrder(orderId);

  const customerAccountId = orderDetails.customerAccountId;
  const customer = await Customer.getCustomer(customerAccountId!);

  const getdeviceId = () => {
    const deviceObjOrder: any = orderDetails?.attributes?.find(
      (item) =>
        item.fullyQualifiedName?.toLowerCase() ===
        "Tenant~DeviceAppToken".toLowerCase()
    );
    if (deviceObjOrder) {
      return deviceObjOrder?.values[0];
    } else {
      const deviceObjCustomer: any = customer?.attributes?.find(
        (item) =>
          item.fullyQualifiedName?.toLowerCase() ===
          "Tenant~deviceapptoken".toLowerCase()
      );
      if (deviceObjCustomer) {
        return deviceObjCustomer?.values[0];
      } else {
        return null;
      }
    }
  };

  const deviceId = getdeviceId();
  console.log(deviceId, ": Device Id");
  console.log("Customer", customer.firstName);

  if (!deviceId) {
    throw new Error("No device id found");
  }
  const message = {
    notification: {
      title: is5Days
        ? "FINAL REMINDER: Your Fleet Farm order is ready!"
        : "REMINDER: We've got your order ready!",
      body: is5Days
        ? `Don't forget - Fleet Farm order ${orderDetails.externalId || orderDetails.orderNumber} is ready for pick up! We'll continue to hold it for 1 day. See you soon, ${customer.firstName}.`
        : `Fleet Farm order ${orderDetails.externalId || orderDetails.orderNumber} is ready for pick up! We'll continue to hold it for 4 days. See you soon, ${customer.firstName}.`,
    },
    token: deviceId,
  };

  console.log("Message", message.notification.title);

  await messaging
    .send(message)
    .then((response) => {
      console.log("response", response);
      return 200;
    })
    .catch((error) => {
      console.log("error", error);
      throw new Error("Error sending notification");
    });

  return 200;
};
