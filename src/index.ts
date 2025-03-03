import express, { Request, response, Response } from 'express';
import { messaging } from './config/firebase';
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

    const data = await sendNotification(event)
    console.log("data------->>>>>>>>>",data)

    if (data) {
      const message = {
        notification: {
          title: data?.title,
          body: data?.body,
        },
        token: data.token
      }
      await messaging.send(message).then(response => {
        console.log(response);
        res.status(200).json({
          message: 'Event received and processed successfully',
          eventId: "docRef.id",
          data: data
        });
      }).catch(error => {
        console.error('Error sending notification:', error);
        res.status(500).json({
          message: 'Failed to send notification',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Failed to send notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 