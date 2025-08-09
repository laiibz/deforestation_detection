# Forest Guardian - AI Deforestation Detection

## Setup Instructions

### 1. Google OAuth Configuration

To fix the "can't reach page" error when clicking Google signup, you need to:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add these Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`
   - Add these Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:5000`
5. **Copy your credentials**:
   - Copy the Client ID and Client Secret

### 2. Update Environment Variables

Edit `backend/.env` file and replace the placeholder values:

```env
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
MONGO_URI=mongodb://127.0.0.1:27017/deforestationDB
SESSION_SECRET=your_session_secret_here
PORT=5000
NODE_ENV=development
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Start the Application

```bash
# Start backend server (in backend directory)
npm run dev

# Start frontend (in frontend directory, new terminal)
npm start
```

### 5. Test the Application

1. Open http://localhost:3000
2. Go to the signup page
3. Click "Continue with Google"
4. You should now be redirected to Google's OAuth page

## Troubleshooting

- **"Can't reach page" error**: Make sure you've configured Google OAuth credentials correctly
- **MongoDB connection issues**: The app will use in-memory storage if MongoDB is not available
- **CORS errors**: Make sure both frontend (port 3000) and backend (port 5000) are running

## Features

- ✅ Google OAuth Authentication
- ✅ JWT-based session management
- ✅ User registration and login
- ✅ Protected routes
- ✅ AI-powered deforestation detection
- ✅ Modern, responsive UI 