package expo.modules.colorthiefnative

import android.graphics.Bitmap
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class ColorThiefOptionsRecord : Record {
    @Field val colorCount: Int = 10
    @Field val quality: Int = 10
    @Field val colorSpace: String = "oklch" // "rgb" | "oklch"
    @Field val ignoreWhite: Boolean = true
}

class ExpoColorThiefNativeModule : Module() {

    // A classe `Module` não expõe `context` diretamente — o Android
    // Context vem do AppContext do próprio módulo.
    private val androidContext
        get() = appContext.reactContext
            ?: throw IllegalStateException("React context indisponível")

    override fun definition() = ModuleDefinition {
        Name("ExpoColorThiefNative")

        // AsyncFunction já roda fora da main thread por padrão no Expo
        // Modules API — decode de bitmap e quantização não travam a UI.
        AsyncFunction("getColor") { imageUri: String, options: ColorThiefOptionsRecord ->
            val bitmap = ImageSampler.loadBitmap(androidContext, imageUri)
            try {
                val samples = ImageSampler.sample(bitmap, options.quality, options.ignoreWhite, options.colorSpace)
                val boxes = MMCQ.quantize(samples, max(2, options.colorCount))
                val dominant = boxes.maxByOrNull { it.population() } ?: return@AsyncFunction null
                toRecord(dominant, samples.size)
            } finally {
                bitmap.recycleSafely()
            }
        }

        AsyncFunction("getPalette") { imageUri: String, options: ColorThiefOptionsRecord ->
            val bitmap = ImageSampler.loadBitmap(androidContext, imageUri)
            try {
                val samples = ImageSampler.sample(bitmap, options.quality, options.ignoreWhite, options.colorSpace)
                val boxes = MMCQ.quantize(samples, max(2, options.colorCount))
                boxes.map { toRecord(it, samples.size) }
            } finally {
                bitmap.recycleSafely()
            }
        }

        AsyncFunction("getSwatches") { imageUri: String, options: ColorThiefOptionsRecord ->
            val bitmap = ImageSampler.loadBitmap(androidContext, imageUri)
            try {
                // Swatches precisam de material suficiente pra cobrir os 6
                // targets; usamos um colorCount mínimo mais generoso mesmo
                // que o caller peça menos, e ele não é exposto no resultado.
                val effectiveCount = max(16, options.colorCount)
                val samples = ImageSampler.sample(bitmap, options.quality, options.ignoreWhite, options.colorSpace)
                val boxes = MMCQ.quantize(samples, effectiveCount)
                val swatches = SwatchExtractor.extract(boxes)
                swatches.mapValues { (_, box) -> toRecord(box, samples.size) }
            } finally {
                bitmap.recycleSafely()
            }
        }
    }

    private fun toRecord(box: MMCQ.VBox, totalSamples: Int): ColorThiefColorRecord {
        val rgb = box.avgRgb()
        return ColorThiefColorRecord(rgb[0], rgb[1], rgb[2], box.population(), totalSamples)
    }

    private fun Bitmap.recycleSafely() {
        if (!isRecycled) recycle()
    }

    private fun max(a: Int, b: Int) = if (a > b) a else b
}
