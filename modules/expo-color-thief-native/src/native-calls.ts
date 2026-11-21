import { buildColor } from './build-color';
import NativeModule from './expo-color-thief-module';
import type {
  ColorThiefColorData,
  ColorThiefOptions,
  NativeColorThiefOptions,
} from './expo-color-thief.types';

let requestCounter = 0;

/** Valida e aplica os defaults; o que sai daqui é exatamente o que o Kotlin recebe. */
export function resolveOptions(options?: ColorThiefOptions): NativeColorThiefOptions {
  const colorCount = options?.colorCount ?? 10;
  const quality = options?.quality ?? 10;
  const colorSpace = options?.colorSpace ?? 'oklch';
  const ignoreWhite = options?.ignoreWhite ?? true;
  const region = options?.region;

  if (!Number.isInteger(colorCount) || colorCount < 2 || colorCount > 20) {
    throw new RangeError('colorCount deve ser um inteiro entre 2 e 20');
  }
  if (!Number.isInteger(quality) || quality < 1) {
    throw new RangeError('quality deve ser um inteiro maior ou igual a 1');
  }
  if (colorSpace !== 'rgb' && colorSpace !== 'oklch') {
    throw new RangeError("colorSpace deve ser 'rgb' ou 'oklch'");
  }
  if (
    region &&
    !(
      region.x >= 0 &&
      region.x < 1 &&
      region.y >= 0 &&
      region.y < 1 &&
      region.width > 0 &&
      region.width <= 1 &&
      region.height > 0 &&
      region.height <= 1
    )
  ) {
    throw new RangeError(
      'region usa coordenadas normalizadas de 0 a 1, com width e height maiores que 0'
    );
  }

  return { colorCount, quality, colorSpace, ignoreWhite, ...(region ? { region } : {}) };
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw signal.reason ?? Object.assign(new Error('The operation was aborted'), { name: 'AbortError' });
  }
}

/** Chamada nativa com requestId e suporte a AbortSignal. */
export async function callNative<T>(
  signal: AbortSignal | undefined,
  call: (requestId: string) => Promise<T>
): Promise<T> {
  throwIfAborted(signal);

  const requestId = String(++requestCounter);
  const onAbort = () => NativeModule?.cancel(requestId);
  signal?.addEventListener('abort', onAbort);

  try {
    const result = await call(requestId);
    throwIfAborted(signal);
    return result;
  } catch (error) {
    throwIfAborted(signal);
    throw error;
  } finally {
    signal?.removeEventListener('abort', onAbort);
  }
}

/** [r, g, b, population, ...] -> cores completas, com proportion calculada. */
export function flatToColors(flat: number[]): ColorThiefColorData[] {
  let total = 0;
  for (let i = 3; i < flat.length; i += 4) total += flat[i];

  const colors: ColorThiefColorData[] = [];
  for (let i = 0; i + 3 < flat.length; i += 4) {
    colors.push(
      buildColor(flat[i], flat[i + 1], flat[i + 2], flat[i + 3], total > 0 ? flat[i + 3] / total : 0)
    );
  }
  return colors;
}

/**
 * 3 passes (grosso -> médio -> final) sobre uma única decodificação. Os passes
 * 1 e 2 chegam por evento e o 3 pelo retorno da função; se o retorno chegar
 * antes de um evento atrasado, o evento é descartado (nunca volta pra um
 * passe mais grosso).
 */
export async function* progressivePalette(
  imageUri: string,
  options: NativeColorThiefOptions,
  signal?: AbortSignal
): AsyncGenerator<ColorThiefColorData[]> {
  const native = NativeModule;
  if (!native) return;

  throwIfAborted(signal);

  const requestId = String(++requestCounter);
  const queue: { pass: number; colors: number[] }[] = [];
  const state: {
    finished: boolean;
    failed: boolean;
    failure: unknown;
    wake: (() => void) | null;
  } = { finished: false, failed: false, failure: undefined, wake: null };

  const subscription = native.addListener('onPass', (event) => {
    if (event.requestId !== requestId) return;
    queue.push({ pass: event.pass, colors: event.colors });
    state.wake?.();
  });

  const onAbort = () => native.cancel(requestId);
  signal?.addEventListener('abort', onAbort);

  native
    .getPaletteProgressive(imageUri, options, requestId)
    .then(
      (colors) => {
        queue.push({ pass: 3, colors });
      },
      (error) => {
        state.failed = true;
        state.failure = error;
      }
    )
    .finally(() => {
      state.finished = true;
      state.wake?.();
    });

  let lastPass = 0;

  try {
    while (true) {
      const next = queue.shift();
      if (next) {
        if (next.pass > lastPass) {
          lastPass = next.pass;
          yield flatToColors(next.colors);
        }
        continue;
      }
      if (state.finished) break;
      await new Promise<void>((resolve) => {
        state.wake = resolve;
      });
      state.wake = null;
    }

    throwIfAborted(signal);
    if (state.failed) throw state.failure;
  } finally {
    subscription.remove();
    signal?.removeEventListener('abort', onAbort);
    if (!state.finished) native.cancel(requestId);
  }
}
