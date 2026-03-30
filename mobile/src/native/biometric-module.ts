import { NativeModules, Platform } from 'react-native';

type BiometricNativeModule = {
  isAvailable: () => Promise<boolean>;
  authenticate: (reason: string) => Promise<boolean>;
};

const NativeBiometric = NativeModules.BiometricModule as
  | BiometricNativeModule
  | undefined;

async function isAvailable(): Promise<boolean> {
  if (Platform.OS !== 'android' || !NativeBiometric) {
    return false;
  }
  try {
    return await NativeBiometric.isAvailable();
  } catch {
    return false;
  }
}

async function authenticate(reason: string): Promise<void> {
  if (Platform.OS !== 'android' || !NativeBiometric) {
    throw new Error('Biometric native module not available');
  }
  await NativeBiometric.authenticate(reason);
}

export const biometricModule = {
  isAvailable,
  authenticate,
};
