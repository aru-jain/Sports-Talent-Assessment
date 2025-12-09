# CoreX - AI-Powered Athlete Performance Analysis System

A comprehensive Next.js application built for the Sports Authority of India (SAI) to revolutionize athlete performance analysis through AI-powered video assessment and talent identification.

## 🏆 Features

### For Athletes
- **Secure KYC Verification**: Aadhaar-based identity verification through mock DigiLocker integration
- **Comprehensive Onboarding**: Multi-step form with body measurements, medical records, and profile setup
- **SAI Assessments**: Official performance tests including push-ups, pull-ups, sprints, and more
- **AI Video Analysis**: Upload training videos for automated form analysis and feedback
- **Performance Tracking**: Detailed progress monitoring with scores, improvements, and rankings
- **Mobile-First Design**: Optimized for mobile devices with smooth animations

### For SAI Officials
- **Analytics Dashboard**: Comprehensive overview of athlete performance across India
- **Talent Discovery**: Advanced filtering and ranking system to identify top performers
- **State-wise Monitoring**: Performance tracking by geographical regions
- **Real-time Alerts**: System notifications for performance anomalies and opportunities
- **Export Capabilities**: Data export for further analysis and reporting

## 🚀 Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth transitions
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **State Management**: Local Storage for data persistence
- **Build Tool**: Bun

## 🎨 Design System

The application uses a green-themed design system inspired by the reference images:
- **Primary Colors**: Emerald green palette (#10b981)
- **Typography**: Geist Sans font family
- **Components**: Rounded corners, soft shadows, and smooth transitions
- **Responsive**: Mobile-first approach with desktop optimization for SAI dashboard

## 📱 Application Structure

### Athlete App (Mobile-Optimized)
```
/                    - Landing page
/onboarding         - Multi-step onboarding flow
  /kyc              - Identity verification
  /measurements     - Body measurements with BMI calculator
  /medical          - Medical records management
/dashboard          - Main athlete dashboard
  /assessments      - Available SAI assessments
  /sessions         - Training session history
  /progress         - Performance analytics
  /profile          - User profile management
```

### SAI Dashboard (Desktop-Optimized)
```
/sai-dashboard      - Analytics overview
  /athletes         - Athlete management
  /assessments      - Assessment monitoring
  /talent           - Talent identification
  /settings         - System configuration
```

## 🔧 Key Components

### Video Processing Simulation
- File upload with validation
- Multi-step processing visualization
- Mock AI analysis with realistic timing
- Performance metrics generation
- Security verification (anti-cheating)

### Data Persistence
- Local storage for user data
- Session management
- Progress tracking
- Assessment results

### Mock Integrations
- DigiLocker KYC verification UI
- AI pose detection simulation
- Video processing pipeline
- Performance analytics

## 📊 Assessment Types

1. **Push-ups**: Upper body strength evaluation
2. **Pull-ups**: Back and arm strength test
3. **Sit-ups**: Core strength assessment
4. **Lunges**: Lower body stability test
5. **Sprint**: Speed and agility evaluation
6. **Burpees**: Full-body cardiovascular test
7. **Agility Ladder**: Coordination assessment
8. **Cone Drill**: Change of direction test

## 🎯 Performance Metrics

Each assessment provides:
- **Form Score**: Technique and posture analysis
- **Speed Score**: Movement velocity evaluation
- **Endurance Score**: Stamina assessment
- **Overall Score**: Composite performance rating
- **Improvement Tracking**: Progress over time
- **Personalized Feedback**: AI-generated recommendations

## 🛡️ Security Features

- Mock KYC verification process
- Video encryption simulation
- Anti-cheating detection
- Secure data storage
- Privacy protection measures

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   bun install
   ```

2. **Run Development Server**
   ```bash
   bun run dev
   ```

3. **Access the Application**
   - Athlete App: `http://localhost:3000`
   - SAI Dashboard: `http://localhost:3000/sai-dashboard`

## 📝 Usage Flow

### For Athletes
1. Complete onboarding with KYC verification
2. Enter body measurements and medical history
3. Browse available SAI assessments
4. Upload training videos for analysis
5. Receive AI-generated feedback and scores
6. Track progress and improvement over time

### For SAI Officials
1. Access comprehensive analytics dashboard
2. Monitor athlete performance across states
3. Identify top talent using filtering system
4. Export data for further analysis
5. Manage system settings and configurations

## 🎨 UI/UX Highlights

- **Smooth Animations**: Framer Motion for engaging interactions
- **Mobile-First**: Optimized for athlete mobile usage
- **Professional Design**: Clean, modern interface for SAI officials
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Loading States**: Realistic processing simulations
- **Error Handling**: User-friendly error messages and validation

## 📈 Mock Data

The application includes comprehensive mock data for:
- Athlete profiles and performance metrics
- Assessment results and progress tracking
- State-wise performance statistics
- System alerts and notifications
- Talent identification rankings

## 🔮 Future Enhancements

- Real AI video analysis integration
- Live DigiLocker API connection
- Advanced biometric analysis
- Machine learning model training
- Real-time performance monitoring
- Mobile app development
- Cloud infrastructure deployment

## 🤝 Contributing

This project was built as a demonstration for the Smart India Hackathon 2025. The codebase showcases modern React development practices and can serve as a foundation for real-world implementation.

## 📄 License

Built for Smart India Hackathon 2025 - Sports Authority of India

---

**Note**: This is a proof-of-concept application with simulated AI processing and mock integrations. All video analysis, KYC verification, and data processing are simulated for demonstration purposes.