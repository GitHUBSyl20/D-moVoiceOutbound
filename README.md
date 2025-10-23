# Demo Voice Outbound Calling

A simple and elegant web application for initiating outbound calls using Twilio and Voiceflow.

## Features

- 🎨 Clean and modern UI
- 📱 Phone number input with validation
- 🔄 Real-time call status feedback
- 🔐 Secure server-side API integration
- 🎯 Voiceflow integration for call handling

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v14 or higher) installed
2. **Twilio Account** with:
   - Account SID
   - Auth Token
   - A Twilio phone number with voice capabilities
3. **Voiceflow Project** with:
   - A webhook URL configured for voice calls

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Then edit `.env` with your credentials:

```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
VOICEFLOW_WEBHOOK_URL=your_voiceflow_webhook_url_here
PORT=3000
```

### 3. Voiceflow Configuration

In your Voiceflow project:

1. Create a voice assistant project
2. Design your conversation flow
3. Get your project's webhook URL from Voiceflow
4. Configure the webhook to handle incoming TwiML requests

The webhook URL typically looks like:
```
https://general-runtime.voiceflow.com/state/your-project-id/interact
```

Or you can create a custom endpoint in Voiceflow that returns TwiML for Twilio.

### 4. Run the Application

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. Enter a phone number (including country code, e.g., +1234567890)
2. Click the "Start Call" button
3. The application will initiate a call to the entered number
4. Voiceflow will handle the call flow once connected

## Project Structure

```
D-moVoiceOutbound/
├── public/
│   ├── index.html      # Front-end HTML
│   ├── style.css       # Styling
│   └── script.js       # Client-side JavaScript
├── server.js           # Express server and API
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore rules
└── README.md          # Documentation
```

## API Endpoints

### POST `/api/call`
Initiates an outbound call to the specified phone number.

**Request Body:**
```json
{
  "phoneNumber": "+1234567890"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Call initiated successfully",
  "callSid": "CA..."
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message"
}
```

### GET `/api/health`
Health check endpoint to verify server status.

## Security Notes

- Never commit your `.env` file to version control
- Keep your Twilio credentials secure
- Consider implementing rate limiting for production use
- Add authentication if exposing publicly

## Troubleshooting

### Call not connecting
- Verify your Twilio credentials are correct
- Ensure your Twilio phone number has voice capabilities
- Check that the phone number format includes country code
- Verify your Voiceflow webhook URL is correct and accessible

### Server errors
- Check all environment variables are set correctly
- Ensure you have sufficient Twilio credits
- Review server logs for specific error messages

## License

ISC

## Support

For issues related to:
- **Twilio**: Check [Twilio Documentation](https://www.twilio.com/docs)
- **Voiceflow**: Check [Voiceflow Documentation](https://www.voiceflow.com/docs)

