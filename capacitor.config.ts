import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'tech.harshdeep.corex',
  appName: 'CoreX',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#161616",
      showSpinner: true,
      spinnerColor: "#CAF554"
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true
  },
  ios: {
    contentInset: 'automatic'
  }
};

export default config;
