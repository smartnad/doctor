# 🏥 Doctor Appointment App

A modern, feature-rich doctor appointment booking application built with React Native, Expo, and Supabase.

## ✨ Features

### For Patients
- 🔍 **Smart Search** - Find doctors by name or specialty
- 📋 **Filter by Category** - Browse doctors by medical specialization
- 👨‍⚕️ **Doctor Profiles** - View detailed information, ratings, and consultation fees
- 📅 **Easy Booking** - Simple appointment scheduling system
- ✅ **Booking Confirmation** - Beautiful success screen with animations
- 📱 **My Appointments** - Track all your upcoming and past appointments

### For Doctors
- 📊 **Dashboard** - Overview of all appointments and requests
- ✅ **Appointment Management** - Confirm or cancel appointment requests
- 💊 **Prescription Writing** - Add prescriptions with medicines and instructions
- 📅 **Schedule Management** - Set your weekly availability
- 👥 **Patient History** - View patient medical history and past consultations

## 🎨 UI/UX Highlights

- **Premium Design** - Modern, clean, and professional interface
- **Smooth Animations** - Using `react-native-reanimated` for fluid transitions
- **Hero Banner** - Eye-catching homepage with call-to-action
- **Enhanced Doctor Cards** - Display ratings, badges, fees, and specialties
- **Crown Badges** - Top-rated doctors (4.5+ rating) get special recognition
- **Consistent Theme** - Material Design 3 with React Native Paper

## 🛠️ Tech Stack

- **Framework:** React Native (Expo)
- **UI Library:** React Native Paper
- **Navigation:** React Navigation
- **State Management:** Zustand
- **Backend:** Supabase (Authentication & Database)
- **Animations:** React Native Reanimated
- **Icons:** @expo/vector-icons
- **Testing:** Jest + React Native Testing Library

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/smartnad/doctor.git

# Navigate to project directory
cd doctor

# Install dependencies
npm install

# Start the development server
npm start
```

## 🚀 Running the App

```bash
# Run on Web
npm run web

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 🎭 Demo Mode

The app includes a demo mode for testing without backend setup:

- **Demo Patient:** username: `demo-patient`, password: `demo123`
- **Demo Doctor:** username: `demo-doctor`, password: `demo123`

## 📱 Key Screens

1. **Login/Signup** - Authentication with role selection
2. **Home** - Browse doctors with search and filters
3. **Doctor Details** - View complete doctor profile
4. **Book Appointment** - Select date and time
5. **Booking Success** - Animated confirmation screen
6. **My Appointments** - Patient appointment list
7. **Doctor Dashboard** - Appointment management for doctors
8. **Add Prescription** - Write prescriptions with animations
9. **Profile** - User profile management

## 🎯 Features in Detail

### Patient Features
- Beautiful home screen with hero banner
- Category-based doctor filtering
- "See All" specialties page
- Real-time search functionality
- Doctor cards with ratings and consultation fees
- Crown badges for top doctors (4.5+ stars)
- Smooth booking flow with success confirmation

### Doctor Features
- Auto-refreshing dashboard
- Separate sections for pending and confirmed appointments
- One-click confirm/cancel for appointments
- Prescription management with dynamic medicine fields
- Patient history viewer
- Weekly schedule manager with time slots
- Demo mode data persistence

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Smartnad**

## 🙏 Acknowledgments

- React Native community
- Expo team
- Supabase for backend services
- Material Design for design guidelines
