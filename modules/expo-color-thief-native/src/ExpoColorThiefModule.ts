import { requireNativeModule } from 'expo-modules-core';
import type { NativeExpoColorThiefModule } from './ExpoColorThief.types';

// O nome precisa bater com o registrado em Kotlin: Name("ExpoColorThiefNative")
export default requireNativeModule<NativeExpoColorThiefModule>('ExpoColorThiefNative');
