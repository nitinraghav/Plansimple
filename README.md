# Plansimple

A mobile application for legacy planning and document management.

## Features

- User authentication
- Document management
- Category organization
- File attachments
- Secure data storage
- Cross-platform support

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- Firebase account

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/plansimple.git
cd plansimple
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- Fill in your Firebase configuration

## Development

Start the development server:
```bash
npm start
```

Run tests:
```bash
npm test
```

## Building for Production

### iOS

1. Configure app signing in Xcode
2. Update app.json with your bundle identifier
3. Build the app:
```bash
eas build --platform ios
```

### Android

1. Generate a keystore file
2. Update app.json with your package name
3. Build the app:
```bash
eas build --platform android
```

## Deployment

### App Store (iOS)

1. Create an App Store Connect account
2. Create a new app in App Store Connect
3. Upload screenshots and app metadata
4. Submit for review:
```bash
eas submit --platform ios
```

### Play Store (Android)

1. Create a Google Play Console account
2. Create a new app in Play Console
3. Upload screenshots and app metadata
4. Submit for review:
```bash
eas submit --platform android
```

## Environment Setup

1. Development:
```bash
npm run start:dev
```

2. Staging:
```bash
npm run start:staging
```

3. Production:
```bash
npm run start:prod
```

## Required Assets

Place the following files in the `assets` directory:
- `icon.png` (1024x1024)
- `splash.png` (1242x2436)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)

## Security

- All API keys and sensitive data are stored in environment variables
- Firebase security rules are configured for data protection
- User authentication is handled through Firebase Auth
- Data is encrypted in transit and at rest

## Support

For support, email [your-email@domain.com] or open an issue in the repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 