# expo-color-thief-native

Módulo Expo **local** (Kotlin nativo, Android) que replica a API do
[`colorthief`](https://github.com/lokesh/color-thief) v3 —
`getColor`, `getPalette`, `getSwatches` (Vibrant/Muted/DarkVibrant/DarkMuted/
LightVibrant/LightMuted), `getPaletteProgressive`, `createColor`,
`population`/`proportion`, **extração por região**, quantização em RGB ou
OKLCH e objetos de cor ricos (`hex`, `hsl`, `oklch`, `contrast`, `textColor`
etc.) — rodando 100% em Kotlin, sem passar por JS/Skia.

Sem `*Sync` (a bridge nativa é sempre assíncrona) e sem `observe()` (vídeo).

## Uso

```ts
import {
  createColor,
  getColor,
  getPalette,
  getPaletteProgressive,
  getSwatches,
} from 'expo-color-thief-native';

const color = await getColor(imageUri, { quality: 5, colorSpace: 'oklch', ignoreWhite: true });
console.log(color?.hex, color?.textColor, color?.proportion);

// só o terço inferior da imagem (coordenadas normalizadas 0–1)
const bottom = await getPalette(imageUri, {
  colorCount: 5,
  region: { x: 0, y: 0.66, width: 1, height: 0.34 },
});
bottom.forEach((c) => console.log(c.hex, c.population, c.proportion)); // proportion = fatia da região

const swatches = await getSwatches(imageUri);
console.log(swatches.Vibrant?.hex, swatches.DarkMuted?.hex);

// 3 passes sobre uma única decodificação: grosso -> médio -> final
for await (const palette of getPaletteProgressive(imageUri)) {
  console.log(palette.map((c) => c.hex));
}

// cancelamento
const controller = new AbortController();
const pending = getPalette(imageUri, { signal: controller.signal });
controller.abort();

createColor(232, 67, 147, 100); // objeto de cor completo, sem passar pelo nativo
```

## Opções

| Opção         | Default   | Descrição                                                                     |
| ------------- | --------- | ----------------------------------------------------------------------------- |
| `colorCount`  | `10`      | Nº de cores da paleta (2–20). Ignorado em `getColor` (usa 5 internamente).     |
| `quality`     | `10`      | Passo da amostragem: 1 = todo pixel, 10 = ~1 a cada 10.                        |
| `colorSpace`  | `'oklch'` | `'rgb'` (MMCQ clássico) ou `'oklch'` (agrupamento perceptual).                 |
| `ignoreWhite` | `true`    | Ignora pixels quase brancos (`r,g,b > 250`). Se a imagem for toda branca, conta o branco. |
| `region`      | imagem toda | `{ x, y, width, height }` normalizados (0–1) a partir do canto superior esquerdo. Passar da borda direita/inferior é cortado; `x`/`y` fora de [0, 1) ou `width`/`height` fora de (0, 1] geram erro. |
| `signal`      | —         | `AbortSignal`: cancela a extração e a Promise rejeita com `signal.reason`.     |

`population` é a contagem de pixels **amostrados** e `proportion` é a fração
dentro da região (ou da imagem inteira, sem `region`).

## Onde fica a performance

1. **Decode já reduzido e recortado.** `ImageSampler.load` escolhe o maior
   `inSampleSize` que ainda deixa o lado maior da área de interesse com 300px
   ou mais. Com `region`, usa `BitmapRegionDecoder` e decodifica só o
   retângulo pedido (GIF/BMP, sem suporte a região, caem num decode completo
   recortado).
2. **Histograma em array (`IntArray` 32×32×32), sem objeto por pixel e sem
   `HashMap`/boxing.** O loop de pixels só incrementa quatro inteiros. Em
   `oklch` a conversão para OKLab é feita por pixel com uma tabela de
   sRGB→linear pré-calculada.
3. **Leitura linha a linha** (`getPixels` de 1 linha) em grade 2D pelo
   `quality`, sem alocar o bitmap inteiro como `IntArray`.
4. **Cor final = média real dos pixels** da caixa (somas por célula), não o
   centro da célula.
5. **Progressivo sem redecodificar**: os 3 passes reaproveitam o mesmo bitmap.
6. **Swatches não reprocessam pixels**: `SwatchExtractor` só pontua as caixas
   que o MMCQ já produziu.
7. **Cancelamento** checado a cada linha lida.

O median cut em `rgb` produz exatamente as mesmas caixas do MMCQ original do
color-thief (conferido de 2 a 20 cores). Quando o eixo mais largo não consegue
dividir uma caixa, tenta os outros eixos em vez de desistir.

## Limitações conhecidas

- `quality` atua sobre o bitmap já reduzido (≥ 300px no lado maior), então
  `quality: 1` significa "todo pixel dessa versão reduzida".
- Orientação EXIF não é aplicada (irrelevante para capas de álbum; em fotos
  rotacionadas via EXIF a `region` é medida na orientação crua do arquivo).
- `isDark` é `true` quando o branco tem mais contraste que o preto, ou seja,
  sempre coerente com `textColor`.

## Instalação (módulo local)

```bash
npx expo prebuild --platform android
npx expo run:android
```

Como este pacote contém Kotlin, qualquer alteração exige gerar e instalar um
novo APK/dev build; Fast Refresh e updates JS não adicionam
`ExpoColorThiefNative` ao binário. A API JS retorna vazio (`null`, `[]` ou
`{}`) quando o binário não tem o módulo, e `isNativeModuleAvailable` diz se ele
está presente.

## Estrutura

```
android/src/main/java/expo/modules/colorthiefnative/
  ColorMath.kt                   # sRGB<->HSL/OKLab/OKLCH, contraste WCAG, Record de saída
  MMCQ.kt                        # median cut sobre histograma em array (RGB ou OKLab)
  ImageSampler.kt                # leitura da fonte, decode com downsample/região, preenchimento do histograma
  SwatchExtractor.kt             # scoring Vibrant/Muted/Dark*/Light*
  ExpoColorThiefNativeModule.kt  # funções expostas ao JS (Name: "ExpoColorThiefNative")
src/
  index.ts                       # API pública
  expo-color-thief.types.ts
  expo-color-thief-module.ts     # requireOptionalNativeModule('ExpoColorThiefNative')
  native-calls.ts                # opções, AbortSignal e passes progressivos
  build-color.ts                 # mesma matemática do ColorMath.kt, em JS
```

Os imports dentro de `src/` são relativos de propósito: este é um pacote
(`file:` dependency) com `tsconfig` próprio, onde o alias `@/` do app não
resolve. No app, importe sempre pelo nome do pacote: `from 'expo-color-thief-native'`.
