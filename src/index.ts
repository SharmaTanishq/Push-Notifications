import express, { Request, response, Response } from 'express';
import {  messaging } from './config/firebase';
import { sendNotification } from './kibo/EventMap';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Event endpoint
app.post('/event', async (req: Request, res: Response) => {
  try {
    const event = req.body;
    console.log('Received event:', event);
    
    const data = sendNotification(event)

    if (event.notification) {
        
      // const message = {
      //   notification: {
      //     title: eventData.notification.title || 'New Notification',
      //     body: eventData.notification.body || 'You have a new notification'
      //   },        
      //   token: "eFw-Iu8wrkXLjmLUZEjme_:APA91bFrecwduHLfHBvMU8s_Os6ke5Tg5LsgzaRk4iu7Sy4k5g7geBsqe6gqwEZ6uOe7yLwOwItoyqF1Ss_8jvl7SRIB_K8GZTs-rB1K11VB1WlgPzZQB5s" ,// You can specify topics or tokens
      //   //topic: eventData.topic || 'all' // You can specify topics or tokens

      // };

      //DEVICE ID -> KIBO. 
      //KIBO -> One Time Migration => Device ID.
      //KIBO -> Device ID -> FCM Token.


      //const response = await messaging.send(message);
      console.log('Successfully sent notification:', data);
    }
    
    res.status(200).json({
      message: 'Event received and processed successfully',
      eventId: "docRef.id",
      data: data
    });
  } catch (error) {
    console.error('Error processing event:', error);
    res.status(400).json({
      message: 'Failed to process event',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 