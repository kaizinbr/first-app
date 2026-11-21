package expo.modules.colorthiefnative

import android.graphics.Bitmap
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicBoolean
import kotlin.math.max

class RegionRecord : Record {
    @Field val x: Double = 0.0
    @Field val y: Double = 0.0
    @Field val width: Double = 1.0
    @Field val height: Double = 1.0
}

class ColorThiefOptionsRecord : Record {
    @Field val colorCount: Int = 10
    @Field val quality: Int = 10
    @Field val colorSpace: String = "oklch" // "rgb" | "oklch"
    @Field val ignoreWhite: Boolean = true
    @Field val region: RegionRecord? = null
}

/** Lançada internamente quando o JS cancela (AbortSignal) uma extração em andamento. */
class ExtractionCancelled : RuntimeException()

class ColorThiefException(message: String, cause: Throwable? = null) :
    CodedException(message, cause)

class ExpoColorThiefNativeModule : Module() {

    // Cada chamada vem com um requestId; `cancel` só levanta a flag dessa chamada.
    private val requests = ConcurrentHashMap<String, AtomicBoolean>()

    // A classe `Module` não expõe `context` diretamente — o Android
    // Context vem do AppContext do próprio módulo.
    private val androidContext
        get() = appContext.reactContext
            ?: throw IllegalStateException("React context indisponível")

    override fun definition() = ModuleDefinition {
        Name("ExpoColorThiefNative")

        Events("onPass")

        Function("cancel") { requestId: String ->
            requests.computeIfAbsent(requestId) { AtomicBoolean(false) }.set(true)
        }

        // AsyncFunction já roda fora da main thread por padrão no Expo
        // Modules API — decode de bitmap e quantização não travam a UI.
        AsyncFunction("getColor") { imageUri: String, options: ColorThiefOptionsRecord, requestId: String ->
            withImage<ColorThiefColorRecord?>(imageUri, options, requestId) { image, cancelled ->
                val histogram = collect(image, options, 1, cancelled)
                // getColor sempre quantiza em 5 caixas e devolve a mais populosa
                val boxes = MMCQ.quantize(histogram, 5)
                val dominant = boxes.maxByOrNull { it.population() }
                if (dominant == null) null else toRecord(dominant, histogram.total)
            }
        }

        AsyncFunction("getPalette") { imageUri: String, options: ColorThiefOptionsRecord, requestId: String ->
            withImage(imageUri, options, requestId) { image, cancelled ->
                val histogram = collect(image, options, 1, cancelled)
                val boxes = MMCQ.quantize(histogram, max(2, options.colorCount))
                boxes.map { toRecord(it, histogram.total) }
            }
        }

        AsyncFunction("getSwatches") { imageUri: String, options: ColorThiefOptionsRecord, requestId: String ->
            withImage(imageUri, options, requestId) { image, cancelled ->
                // Swatches precisam de material suficiente pra cobrir os 6
                // targets; usamos um colorCount mínimo mais generoso mesmo
                // que o caller peça menos, e ele não é exposto no resultado.
                val effectiveCount = max(16, options.colorCount)
                val histogram = collect(image, options, 1, cancelled)
                val boxes = MMCQ.quantize(histogram, effectiveCount)
                val swatches = SwatchExtractor.extract(boxes)
                swatches.mapValues { (_, box) -> toRecord(box, histogram.total) }
            }
        }

        // 3 passes sobre o MESMO bitmap decodificado (grosso -> médio -> final).
        // Os passes 1 e 2 saem como evento; o 3 é o retorno da função. Formato
        // plano: [r, g, b, population, r, g, b, population, ...].
        AsyncFunction("getPaletteProgressive") { imageUri: String, options: ColorThiefOptionsRecord, requestId: String ->
            withImage(imageUri, options, requestId) { image, cancelled ->
                val count = max(2, options.colorCount)

                val coarse = flatPalette(collect(image, options, 4, cancelled), count)
                sendEvent("onPass", mapOf("requestId" to requestId, "pass" to 1, "colors" to coarse))

                val medium = flatPalette(collect(image, options, 2, cancelled), count)
                sendEvent("onPass", mapOf("requestId" to requestId, "pass" to 2, "colors" to medium))

                flatPalette(collect(image, options, 1, cancelled), count)
            }
        }
    }

    private fun <T> withImage(
        imageUri: String,
        options: ColorThiefOptionsRecord,
        requestId: String,
        block: (LoadedImage, AtomicBoolean) -> T
    ): T {
        val cancelled = requests.computeIfAbsent(requestId) { AtomicBoolean(false) }
        try {
            validate(options)
            val image = ImageSampler.load(androidContext, imageUri, options.region, cancelled)
            try {
                return block(image, cancelled)
            } finally {
                image.bitmap.recycleSafely()
            }
        } catch (error: ExtractionCancelled) {
            throw ColorThiefException("Extração cancelada", error)
        } catch (error: OutOfMemoryError) {
            throw ColorThiefException("Memória insuficiente para decodificar a imagem", error)
        } finally {
            requests.remove(requestId)
        }
    }

    private fun validate(options: ColorThiefOptionsRecord) {
        if (options.colorCount < 2 || options.colorCount > 256) {
            throw ColorThiefException("colorCount deve estar entre 2 e 256")
        }
        if (options.quality < 1) {
            throw ColorThiefException("quality deve ser maior ou igual a 1")
        }
        if (options.colorSpace != "rgb" && options.colorSpace != "oklch") {
            throw ColorThiefException("colorSpace deve ser 'rgb' ou 'oklch'")
        }
        val region = options.region
        if (region != null && !(region.x >= 0.0 && region.x < 1.0 &&
                region.y >= 0.0 && region.y < 1.0 &&
                region.width > 0.0 && region.width <= 1.0 &&
                region.height > 0.0 && region.height <= 1.0)) {
            throw ColorThiefException(
                "region usa coordenadas normalizadas de 0 a 1, com width e height maiores que 0"
            )
        }
    }

    /**
     * Amostra a imagem e, se a imagem for toda "quase branca" com ignoreWhite
     * ligado, refaz a amostragem contando o branco (senão a paleta ficaria vazia).
     */
    private fun collect(
        image: LoadedImage,
        options: ColorThiefOptionsRecord,
        strideMultiplier: Int,
        cancelled: AtomicBoolean
    ): MMCQ.Histogram {
        var histogram = ImageSampler.fill(
            image, options.quality, strideMultiplier, options.ignoreWhite, options.colorSpace, cancelled
        )
        if (histogram.total == 0 && options.ignoreWhite && histogram.whiteSkipped > 0) {
            histogram = ImageSampler.fill(
                image, options.quality, strideMultiplier, false, options.colorSpace, cancelled
            )
        }
        return histogram
    }

    private fun flatPalette(histogram: MMCQ.Histogram, colorCount: Int): List<Int> {
        val result = ArrayList<Int>()
        for (box in MMCQ.quantize(histogram, colorCount)) {
            val rgb = box.avgRgb()
            result.add(rgb[0])
            result.add(rgb[1])
            result.add(rgb[2])
            result.add(box.population())
        }
        return result
    }

    private fun toRecord(box: MMCQ.VBox, totalSamples: Int): ColorThiefColorRecord {
        val rgb = box.avgRgb()
        return ColorThiefColorRecord(rgb[0], rgb[1], rgb[2], box.population(), totalSamples)
    }

    private fun Bitmap.recycleSafely() {
        if (!isRecycled) recycle()
    }
}
