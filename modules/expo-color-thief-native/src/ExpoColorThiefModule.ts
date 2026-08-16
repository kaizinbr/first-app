import { requireOptionalNativeModule } from 'expo-modules-core';
import type { NativeExpoColorThiefModule } from './ExpoColorThief.types';

// O nome precisa bater com o registrado em Kotlin: Name("ExpoColorThiefNative")
// O carregamento precisa ser opcional: um update JS pode chegar a um dev build/APK
// anterior à inclusão do módulo nativo. Nesse caso, falhar durante o import derruba
// toda a árvore de rotas antes que as telas consigam aplicar seus próprios fallbacks.
export default requireOptionalNativeModule<NativeExpoColorThiefModule>('ExpoColorThiefNative');
