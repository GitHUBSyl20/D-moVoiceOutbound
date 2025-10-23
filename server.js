require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const voiceflowUrl = process.env.VOICEFLOW_WEBHOOK_URL;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Endpoint to initiate a call
app.post('/api/call', async (req, res) => {
  const { phoneNumber } = req.body;

  // Validate phone number
  if (!phoneNumber) {
    return res.status(400).json({ 
      success: false, 
      error: 'Phone number is required' 
    });
  }

  try {
    // Create a call using Twilio
    const call = await client.calls.create({
      to: phoneNumber,
      from: twilioPhoneNumber,
      url: voiceflowUrl, // Voiceflow webhook URL that handles the call flow
      method: 'POST'
    });

    console.log(`Call initiated: ${call.sid} to ${phoneNumber}`);
    
    res.json({ 
      success: true, 
      message: 'Call initiated successfully',
      callSid: call.sid
    });
  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to initiate call'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Make sure to configure your environment variables in .env file`);
});

