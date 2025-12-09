import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export interface CameraPermissions {
  camera: boolean;
  photos: boolean;
}

export class CameraService {
  static async requestPermissions(): Promise<CameraPermissions> {
    try {
      if (!Capacitor.isNativePlatform()) {
        // For web, we'll handle permissions differently
        return { camera: true, photos: true };
      }

      const permissions = await Camera.requestPermissions();
      return {
        camera: permissions.camera === 'granted',
        photos: permissions.photos === 'granted'
      };
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return { camera: false, photos: false };
    }
  }

  static async checkPermissions(): Promise<CameraPermissions> {
    try {
      if (!Capacitor.isNativePlatform()) {
        return { camera: true, photos: true };
      }

      const permissions = await Camera.checkPermissions();
      return {
        camera: permissions.camera === 'granted',
        photos: permissions.photos === 'granted'
      };
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      return { camera: false, photos: false };
    }
  }

  static async takePhoto(options?: {
    quality?: number;
    source?: CameraSource;
    direction?: CameraDirection;
  }) {
    try {
      const image = await Camera.getPhoto({
        quality: options?.quality || 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: options?.source || CameraSource.Camera,
        direction: options?.direction || CameraDirection.Rear
      });

      return image;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  }

  static async pickFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });

      return image;
    } catch (error) {
      console.error('Error picking from gallery:', error);
      throw error;
    }
  }
}
