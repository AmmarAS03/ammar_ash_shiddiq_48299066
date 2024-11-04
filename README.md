# StoryPath Player: Mobile Location-Based Experience App

## 1. Project Description
StoryPath Player is a React Native mobile application that complements the StoryPath web platform, enabling users to participate in interactive, location-based experiences. The app focuses on the participant experience, allowing users to engage with published projects through location tracking and QR code scanning.

### Key Features:
* User profile creation with photo upload
* Browse and participate in published projects
* Real-time location tracking and scoring
* Interactive map visualization
* In-app QR code scanning
* Rich content display for locations
* Progress tracking and scoring system
* Participant statistics

## 2. Core Functionalities

### 2.1 Profile Management
* Custom username selection
* Profile photo upload using device camera or gallery
* Persistent user information across sessions

### 2.2 Project Participation
* View list of available published projects
* See participant counts for each project
* Access project instructions and initial clues
* Track progress and scoring within projects

### 2.3 Location Features
* Real-time location tracking
* Display location-specific content via WebView
* Support for both GPS-based and QR code-based location verification
* View participant statistics for each location

### 2.4 Map Integration
* Interactive map showing current user location
* Display of unlocked location markers
* Visual radius indication for location-based triggers
* Real-time position updates

## 3. Libraries Used

### Core Dependencies
* **React Native**: Mobile application framework
* **Expo**: Development platform and tools
* **Expo Router**: File-based routing solution
* **React Navigation**: Navigation library for drawer and tab navigation

### UI Components
* **NativeWind**: Tailwind CSS for React Native
* **@/components/ui**: shadcn/ui components

### Location & Maps
* **expo-location**: Location services
* **react-native-maps**: MapView component
* **geolib**: Geolocation calculations

### Media & Scanning
* **expo-image-picker**: Photo upload functionality
* **expo-camera**: Camera access for QR scanning
* **expo-barcode-scanner**: QR code scanning

### Data Management
* **AsyncStorage**: Local data persistence
* **react-native-webview**: HTML content display

## 4. Installation and Setup

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Start the development server
npx expo start

# Run on iOS simulator
npm run ios

# Run on Android simulator
npm run android
```

## 5. Usage Instructions

### Running the App
1. Ensure you have Expo Go installed on your mobile device or an emulator set up
2. Start the development server using `npx expo start`
3. Scan the QR code with Expo Go (iOS) or your camera app (Android)
4. Allow necessary permissions for location and camera access

### Testing Features
* Use the provided example project for testing all features
* Test both location-based and QR code-based interactions
* Verify scoring system functionality
* Check map integration and location tracking

## 6. API Integration
The app integrates with the StoryPath RESTful API:
* Base URL: https://0b5ff8b0.uqcloud.net/api/
* Endpoints:
  - /project: Access published projects
  - /location: Location data and content
  - /tracking: Participant tracking and scoring

## 7. References & Credits

### Technical Resources
* **Expo Documentation**: https://docs.expo.dev/
* **React Native Maps Guide**: https://github.com/react-native-maps/react-native-maps
* **Expo Router Documentation**: https://docs.expo.dev/router/introduction/

### Design Resources
* **NativeWind Documentation**: https://www.nativewind.dev/
* **shadcn/ui React Native**: https://rnr-docs.vercel.app/

### AI Assistance
ChatGPT and Claude were used for:
* Debugging assistance
* Component structure optimization
* Implementation guidance for React Native features
* Documentation generation

## 8. Known Limitations
* Location accuracy may vary based on device GPS capabilities
* QR code scanning requires good lighting conditions
* HTML content display may vary across different device sizes
* Network connectivity required for most features
