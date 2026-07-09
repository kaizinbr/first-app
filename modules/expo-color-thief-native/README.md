# expo-color-thief-native

Módulo Expo **local** (Kotlin nativo, Android) que replica a API do
[`colorthief`](https://github.com/lokesh/color-thief) v3 —
`getColor`, `getPalette`, `getSwatches` (Vibrant/Muted/DarkVibrant/DarkMuted/
LightVibrant/LightMuted), `population`/`proportion`, quantização em RGB ou
OKLCH, objetos de cor ricos (`hex`, `hsl`, `oklch`, `contrast`, `textColor`
etc.) — só que rodando 100% em Kotlin, sem passar por JS/Skia.

Baseado no algoritmo MMCQ original de `lokesh/color-thief` e na estrutura de
módulo Expo usada por `expo-color-thief` (BogdanTaranenko), mas escrito do
zero para cobrir as opções que a v2 embarcada nesse pacote ainda não tem.

## Por que não dá pra ter `getColorSync`/`getPaletteSync`

No navegador, `colorthief` consegue ser síncrono porque lê pixels de um
`<canvas>` já decodificado na própria thread JS. No React Native/Expo não
existe essa via: qualquer chamada nativa (Kotlin) cruza a bridge/JSI de
forma assíncrona. Por isso este módulo expõe só as versões `Promise`-based
(`getColor`, `getPalette`, `getSwatches`), como o próprio `expo-color-thief`
já faz. `observe()` (leitura reativa de `<video>`) também foi deixado de
fora de propósito — não é um cenário nativo do Android e você já disse que
não precisa dele.

## Onde fica a performance

A escolha de fazer isso em Kotlin puro (sem Skia, sem WASM) é a certa para
"rápido de verdade" em Android:

1. **Downsample no decode, não depois.** `ImageSampler.loadBitmap` calcula
   `inSampleSize` a partir das dimensões reais do arquivo (via
   `inJustDecodeBounds`) e decodifica já em ~300px no lado maior. Isso evita
   alocar/decodificar um bitmap de 4000×3000 pra depois descartar 99% dos
   pixels — é o maior ganho de todos, maior que qualquer otimização no loop
   do MMCQ.
2. **`quality` como stride de amostragem**, igual ao `colorthief` original:
   `quality = 10` lê 1 a cada 10 pixels já no array plano (`getPixels`).
3. **MMCQ com histograma em `HashMap<Long,Int>`** ao invés de array 3D fixo
   — mais rápido pra imagens pequenas/amostradas (poucos buckets ocupados)
   do que alocar `32*32*32` sempre.
4. **`AsyncFunction` do Expo Modules API** já roda fora da main thread por
   padrão, então decode + quantização não travam a UI mesmo em telas com
   várias imagens.
5. **Swatches não reprocessam pixels**: `SwatchExtractor` só pontua as
   caixas que o MMCQ já produziu (rodando `getSwatches` com
   `colorCount` efetivo mínimo de 16 pra ter material suficiente para os
   6 targets), então o custo extra é desprezível.

Se ainda assim precisar de mais velocidade num app com fotos muito grandes,
o próximo passo natural é oferecer a imagem já redimensionada (ex: via
`expo-image-manipulator`) antes de chamar o módulo — mas na prática o
`MAX_DECODE_DIMENSION = 300` já resolve isso internamente.

## Importante: remova o `@b.taranenko/expo-color-thief`

Este módulo substitui totalmente o `@b.taranenko/expo-color-thief`. Se ele
ainda estiver no seu `package.json`, remova — dois módulos nativos Android
coexistindo é a causa de builds quebrarem com erro do tipo:

```
Type expo.modules.colorthief.BuildConfig is defined multiple times
```

(o D8 encontra duas classes `BuildConfig` com o mesmo pacote Java ao
compactar o dex). Para evitar esse tipo de colisão de vez, o pacote Kotlin
deste módulo agora é `expo.modules.colorthiefnative` (namespace próprio,
diferente de qualquer outra lib de color-thief que você possa ter usado
antes) e o nome exposto ao JS é `ExpoColorThiefNative`.

```bash
npm uninstall @b.taranenko/expo-color-thief
npx expo prebuild --clean --platform android
npx expo run:android
```

O `--clean` é importante aqui: ele remove o `android/` gerado (que ainda
teria os artefatos antigos em cache) e regenera do zero com só este módulo.

## Instalação (como módulo local no seu projeto Expo)

```bash
mkdir -p modules
cp -r expo-color-thief-native modules/expo-color-thief-native
```

No `package.json` do seu app:

```json
{
  "dependencies": {
    "expo-color-thief-native": "file:./modules/expo-color-thief-native"
  }
}
```

```bash
npm install
npx expo prebuild --platform android
npx expo run:android
```

(Se preferir, pode publicar como pacote npm privado depois — a estrutura já
segue o padrão de módulo Expo, então `npx expo prebuild` também funciona
puxando de um registry.)

## Uso

```ts
import { getColor, getPalette, getSwatches } from 'expo-color-thief-native';

const color = await getColor(imageUri, {
  quality: 5,
  colorSpace: 'oklch',
  ignoreWhite: true,
});
console.log(color?.hex, color?.textColor, color?.proportion);

const palette = await getPalette(imageUri, { colorCount: 6, colorSpace: 'rgb' });
palette.forEach((c) => console.log(c.hex, c.population, c.proportion));

const swatches = await getSwatches(imageUri, { quality: 5 });
console.log(swatches.Vibrant?.hex, swatches.DarkMuted?.hex);
```

## Opções

| Opção        | Default   | Descrição                                                          |
| ------------ | --------- | -------------------------------------------------------------------|
| `colorCount` | `10`      | Nº de cores da paleta (2–20). Ignorado em `getColor`.               |
| `quality`    | `10`      | 1 = todo pixel, 10 = 1 a cada 10 pixels amostrados.                 |
| `colorSpace` | `'oklch'` | `'rgb'` (MMCQ clássico) ou `'oklch'` (agrupamento perceptual).      |
| `ignoreWhite`| `true`    | Ignora pixels quase brancos (`r,g,b > 250`).                        |

## Estrutura

```
android/src/main/java/expo/modules/colorthiefnative/
  ColorMath.kt                  # sRGB<->HSL/OKLab/OKLCH, contraste WCAG, Record de saída
  MMCQ.kt                       # median-cut genérico (RGB ou OKLab)
  ImageSampler.kt                # decode com downsample + amostragem por quality/ignoreWhite
  SwatchExtractor.kt             # scoring Vibrant/Muted/Dark*/Light*
  ExpoColorThiefNativeModule.kt  # AsyncFunctions expostas ao JS (Name: "ExpoColorThiefNative")
src/
  index.ts                 # API pública (getColor/getPalette/getSwatches + utils)
  ExpoColorThief.types.ts
  ExpoColorThiefModule.ts  # requireNativeModule('ExpoColorThiefNative')
```

## Próximos passos possíveis

- **iOS**: a mesma arquitetura (decode com downsample + MMCQ genérico +
  scoring de swatches) se porta quase 1:1 para Swift usando `UIImage` /
  `CGImage`, caso o app deixe de ser Android-only.
- **Testes**: como `ColorMath`/`MMCQ`/`SwatchExtractor` não dependem de
  `android.graphics`, dá pra rodar JUnit puro em JVM sem emulador — só
  `ImageSampler` (que usa `Bitmap`/`BitmapFactory`) precisa de
  instrumented test ou Robolectric.
