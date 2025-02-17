import express, { Request, Response } from 'express';
import {  messaging } from './config/firebase';

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
    const eventData = req.body;
    console.log('Received event:', eventData);

    // Store event in Firestore
    // const docRef = await db.collection('events').add({
    //   ...eventData,
    //   timestamp: new Date()
    // });

    // If the event includes a notification, send it using Firebase Cloud Messaging

    if (eventData.notification) {
        
      const message = {
        notification: {
          title: eventData.notification.title || 'New Notification',
          body: eventData.notification.body || 'You have a new notification'
        },
        token: eventData.token || 'all' ,// You can specify topics or tokens
        topic: eventData.topic || 'all' // You can specify topics or tokens
      };

      const response = await messaging.send(message,true);
      console.log('Successfully sent notification:', response);
    }
    
    res.status(200).json({
      message: 'Event received and processed successfully',
      eventId: "docRef.id",
      data: eventData
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