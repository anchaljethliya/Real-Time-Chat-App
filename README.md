# Real-Time Chat Application

A modern, responsive chat application built with React and Firebase that allows users to communicate in real-time.

## Features

- **User Authentication**: Secure sign-up and login functionality
- **Real-time Messaging**: Instant message delivery using Firebase
- **User Profiles**: Customizable user profiles with display names
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Online Status**: See when users are online or their last active time
- **Typing Indicators**: Shows when someone is typing a message
- **Read Receipts**: Know when your messages have been read
- **Message Storage**: Chat history is stored securely in Firebase

## Technologies Used

- **React**: For building the user interface
- **Firebase**: 
  - Authentication for user management
  - Firestore for real-time database
  - Storage for user profile images
- **React Router**: For application routing
- **CSS**: For styling components

## Project Structure

```
src/
  components/
    authentication/      # Login, SignUp, and authentication components
    chat/                # Chat interface components
    contacts/            # Contact list and user search
    layout/              # Layout components like Sidebar and MainContent
  contexts/              # React context providers
  services/              # Firebase and other service configurations
```

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/anchaljethliya/Real-Time-Chat-App.git
   cd Real-Time-Chat-App
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```
   npm start
   ```

## Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore Database
4. Set up Storage
5. Update your security rules to allow authenticated users to read/write

## Future Enhancements

- Group chat functionality
- File sharing capabilities
- Voice and video calls
- Message reactions and emojis
- End-to-end encryption

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Anchal Jethliya - anchaljethliya@gmail.com

Project Link: [https://github.com/anchaljethliya/Real-Time-Chat-App](https://github.com/anchaljethliya/Real-Time-Chat-App)
