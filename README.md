# Smart Society Entry Management System

A comprehensive React Native application for managing gated society access with QR-based entry, visitor management, and real-time notifications.

## 🚀 Features

### 🏠 Resident Features
- **QR Code Access**: Generate permanent QR codes for fast gate entry
- **Visitor Management**: Pre-approve visitors and receive real-time notifications
- **Real-time Alerts**: Get notified when visitors arrive or depart
- **Entry History**: View all visitor entries and exits

### 🛡️ Security Guard Features
- **QR Scanner**: Scan resident and visitor QR codes for gate access
- **Visitor Registration**: Register new visitors with photo capture
- **Entry Logs**: Maintain comprehensive entry/exit records
- **Gate Control**: Automated gate opening for authorized access

### 👨‍💼 Admin Features
- **Resident Management**: Add, edit, and manage society residents
- **Visitor Oversight**: Monitor all visitor activities across the society
- **System Settings**: Configure security protocols and working hours
- **Analytics Dashboard**: View society statistics and reports

## 🏗️ Architecture

### User Roles
1. **Resident**: Flat owners with permanent QR access
2. **Security**: Gate personnel with scanning and logging capabilities
3. **Admin**: Society managers with full system control

### Technology Stack
- **Frontend**: React Native with Expo
- **State Management**: Zustand
- **Navigation**: Expo Router
- **UI Components**: Custom components with theming
- **QR Code**: react-native-qrcode-svg, expo-camera
- **Storage**: AsyncStorage for local data

## 📱 Installation

### Prerequisites
- Node.js 16+
- Expo CLI
- React Native development environment

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd smart-society

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Different Platforms
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🔐 Security Features

### QR Code Security
- **Time-based Validation**: QR codes expire after set time
- **Encrypted Data**: All QR data is encrypted
- **One-time Use**: Visitor QR codes are single-use
- **Anti-spoofing**: Digital signatures prevent QR forgery

### Access Control
- **Role-based Access**: Different features for different user roles
- **Photo Verification**: Capture and verify visitor photos
- **Audit Logging**: Complete audit trail of all entries
- **Real-time Monitoring**: Live monitoring of gate activities

## 📊 Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'resident' | 'security' | 'admin';
  flatNumber?: string;
  vehicleNumber?: string;
  isActive: boolean;
  createdAt: string;
}
```

### Visitor
```typescript
interface Visitor {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  flatNumber: string;
  residentId: string;
  photo?: string;
  accompanyingPersons: AccompanyingPerson[];
  status: 'pending' | 'approved' | 'rejected' | 'checked_in' | 'checked_out';
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
}
```

### Entry Log
```typescript
interface EntryLog {
  id: string;
  userId?: string;
  visitorId?: string;
  type: 'resident' | 'visitor';
  action: 'entry' | 'exit';
  timestamp: string;
  guardId: string;
  photo?: string;
  vehicleNumber?: string;
}
```

## 🔄 Workflows

### Resident Entry Flow
1. Resident shows QR code at gate
2. Security guard scans QR code
3. System validates QR code and user
4. Gate opens automatically
5. Entry is logged in system

### Visitor Entry Flow
1. Visitor arrives at gate
2. Security guard registers visitor details
3. Resident receives notification for approval
4. Resident approves/rejects visitor
5. If approved, visitor QR is generated
6. Visitor checks in with QR code

### Emergency Protocols
- **Lockdown Mode**: Instantly lock all entries
- **Blacklist**: Block suspicious visitors
- **Alert System**: Notify all residents of security threats
- **Backup Access**: Manual override for emergencies

## 🎨 UI Components

### Common Components
- **Card**: Reusable card component with consistent styling
- **Button**: Custom button with multiple variants
- **LoadingSpinner**: Consistent loading indicator
- **QRCodeDisplay**: Secure QR code display component
- **QRScanner**: Camera-based QR code scanner

### Theme System
- **Light/Dark Mode**: Automatic theme switching
- **Custom Colors**: Consistent color palette
- **Responsive Design**: Adapts to different screen sizes

## 🔧 Configuration

### Environment Variables
```env
API_BASE_URL=https://your-api-url.com/api
FCM_SERVER_KEY=your-fcm-server-key
```

### Society Settings
- Working hours configuration
- Visitor approval requirements
- Photo capture settings
- Delivery auto-approval rules

## 📱 Demo Accounts

Use these demo accounts to test different roles:

### Resident Account
- **Email**: resident@demo.com
- **Password**: demo123
- **Flat**: A-101
- **Vehicle**: MH-12-AB-1234

### Security Account
- **Email**: security@demo.com
- **Password**: demo123
- **Role**: Security Guard

### Admin Account
- **Email**: admin@demo.com
- **Password**: demo123
- **Role**: Administrator

## 🚦 API Integration

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh

### QR Code Endpoints
- `POST /qr/generate/{userId}` - Generate QR code
- `POST /qr/validate` - Validate QR code

### Visitor Endpoints
- `GET /visitors` - Get visitors list
- `POST /visitors` - Create visitor
- `PATCH /visitors/{id}/status` - Update visitor status

### Entry Log Endpoints
- `GET /entry-logs` - Get entry logs
- `POST /entry-logs` - Create entry log

## 🔔 Notifications

### Push Notification Types
- **Visitor Request**: New visitor awaiting approval
- **Visitor Arrived**: Visitor has checked in
- **Visitor Departed**: Visitor has checked out
- **Security Alert**: Security-related notifications

### Notification Channels
- **Firebase Cloud Messaging**: Push notifications
- **In-App Notifications**: Real-time app notifications
- **Email Notifications**: Optional email alerts

## 🛠️ Development

### Project Structure
```
smart-society/
├── app/                    # Navigation and screens
│   ├── (tabs)/            # Tab navigation
│   ├── login.tsx          # Login screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── common/           # Common UI components
│   ├── auth/             # Authentication components
│   └── qr/              # QR code components
├── store/               # State management
│   ├── authStore.ts     # Authentication state
│   └── visitorStore.ts  # Visitor state
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
│   ├── api.ts          # API service
│   └── qrGenerator.ts  # QR generation utilities
└── constants/           # App constants
```

### State Management
Using Zustand for state management:
- **authStore**: User authentication and profile
- **visitorStore**: Visitors, logs, and notifications

### Styling
- **StyleSheet**: React Native StyleSheet
- **Theming**: Dynamic theming with useTheme
- **Responsive**: Adaptive layouts for different screens

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage
```

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e
```

## 📦 Deployment

### Building for Production
```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android

# Build for Web
npx expo build:web
```

### App Store Deployment
1. Configure app.json with store credentials
2. Build production binaries
3. Submit to respective app stores

## 🔍 Troubleshooting

### Common Issues

#### QR Code Not Scanning
- Check camera permissions
- Ensure proper lighting
- Verify QR code is not damaged
- Update camera drivers

#### Login Issues
- Verify API endpoint is accessible
- Check network connectivity
- Validate credentials format

#### Notification Problems
- Check FCM configuration
- Verify device token registration
- Ensure app has notification permissions

### Debug Mode
Enable debug mode by setting:
```javascript
const DEBUG = true;
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Style
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Add documentation for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- **Email**: support@smartsociety.com
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🗺️ Roadmap

### Upcoming Features
- [ ] Face recognition integration
- [ ] Vehicle number plate recognition
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] IoT device integration
- [ ] Blockchain-based audit logs

### Version History
- **v1.0.0**: Initial release with core features
- **v1.1.0**: Enhanced security features
- **v1.2.0**: Admin dashboard improvements
- **v2.0.0**: AI-powered security features

---

**Built with ❤️ for smarter societies**
