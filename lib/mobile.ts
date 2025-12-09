import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

export class MobileService {
  static async hideSplashScreen() {
    try {
      if (Capacitor.isNativePlatform()) {
        await SplashScreen.hide({
          fadeOutDuration: 300
        });
      }
    } catch (error) {
      console.error('Error hiding splash screen:', error);
    }
  }

  static async showSplashScreen() {
    try {
      if (Capacitor.isNativePlatform()) {
        await SplashScreen.show({
          showDuration: 2000,
          fadeInDuration: 300,
          fadeOutDuration: 300,
          autoHide: true
        });
      }
    } catch (error) {
      console.error('Error showing splash screen:', error);
    }
  }

  static isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  static getPlatform(): string {
    return Capacitor.getPlatform();
  }
}
