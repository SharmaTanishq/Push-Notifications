import { pushToDB } from './PushToDB';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env' });

/**
 * Test script for pushToDB functionality
 */
async function testPushToDB() {
  try {
    console.log('Starting pushToDB test...');
    console.log('Using OCI URL:', process.env.OCI_URL);
    
    // Sample data to be pushed
    const testData = {
      "title": "Test Notification",
      "body": "This is a test notification",
      "token": "1234567890",
      "profileId": "1862400000",
      "orderId": "o979534629"
    }
    
    // Call the pushToDB function
    const result = await pushToDB(testData);
    
   
    
    if (result.success) {
      console.log('Test completed successfully!');
    } else {
      console.error('Test completed with errors:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('Test failed with error:', error);
    throw error;
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testPushToDB()
    .then((result) => {
      console.log('Test execution completed');
      if (!result.success) {
        process.exit(1);
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

export { testPushToDB }; 