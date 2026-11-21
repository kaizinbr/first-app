package expo.modules.colorthiefnative

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.BitmapRegionDecoder
import android.graphics.Rect
import android.net.Uri
import android.util.Base64
import expo.modules.kotlin.exception.CodedException
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.atomic.AtomicBoolean
import kotlin.math.max

/**
 * Erro descritivo para qualquer falha no carregamento/decodificação da
 * imagem. Estende `CodedException` do Expo Modules API, então chega no JS
 * já como um `CodedError` com mensagem legível (em vez de uma mensagem
 * genérica só com a URL).
 */
class ImageLoadException(message: String, cause: Throwable? = null) :
    CodedException(message, cause)

/**
 * Bitmap já reduzido (e recortado, quando há região) + o retângulo dentro
 * dele que deve ser amostrado.
 */
class LoadedImage(
    val bitmap: Bitmap,
    val left: Int,
    val top: Int,
    val right: Int,
    val bottom: Int
)

/**
 * Carrega a imagem já reduzida (inSampleSize) e, quando há `region`, decodifica
 * só o retângulo pedido (BitmapRegionDecoder) — não aloca nem decodifica pixels
 * que seriam descartados depois. É o maior ganho de performance disponível,
 * muito mais impactante que otimizar o loop de quantização em si.
 */
object ImageSampler {

    // sRGB 0-255 -> linear, pré-calculado: evita um Math.pow por canal por pixel
    private val linearLut = DoubleArray(256) { i ->
        val c = i / 255.0
        if (c <= 0.04045) c / 12.92 else Math.pow((c + 0.055) / 1.055, 2.4)
    }

    fun load(context: Context, uri: String, region: RegionRecord?, cancelled: AtomicBoolean): LoadedImage {
        val bytes = readBytes(context, uri)
        if (cancelled.get()) throw ExtractionCancelled()

        val boundsOpts = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        BitmapFactory.decodeByteArray(bytes, 0, bytes.size, boundsOpts)
        val width = boundsOpts.outWidth
        val height = boundsOpts.outHeight
        if (width <= 0 || height <= 0) {
            throw ImageLoadException("Não foi possível decodificar a imagem (formato inválido ou corrompido): $uri")
        }

        val left = if (region == null) 0 else minOf((region.x * width).toInt(), width - 1)
        val top = if (region == null) 0 else minOf((region.y * height).toInt(), height - 1)
        val right = if (region == null) width
        else Math.ceil((region.x + region.width) * width).toInt().coerceIn(left + 1, width)
        val bottom = if (region == null) height
        else Math.ceil((region.y + region.height) * height).toInt().coerceIn(top + 1, height)

        // Decodifica com o maior inSampleSize que ainda deixa o lado maior da
        // área de interesse com 300px ou mais: sobra resolução de sobra para
        // extrair cor, sem gastar CPU/memória em pixels que seriam descartados.
        val longestSide = max(right - left, bottom - top)
        var sampleSize = 1
        while (longestSide / (sampleSize * 2) >= 300) {
            sampleSize *= 2
        }

        val decodeOpts = BitmapFactory.Options().apply {
            inSampleSize = sampleSize
            inPreferredConfig = Bitmap.Config.ARGB_8888
        }

        val partial = left != 0 || top != 0 || right != width || bottom != height

        if (partial) {
            try {
                val decoder = BitmapRegionDecoder.newInstance(bytes, 0, bytes.size, false)
                try {
                    val cropped = decoder.decodeRegion(Rect(left, top, right, bottom), decodeOpts)
                    if (cropped != null) {
                        return LoadedImage(cropped, 0, 0, cropped.width, cropped.height)
                    }
                } finally {
                    decoder.recycle()
                }
            } catch (e: Exception) {
                // formatos sem suporte a decode por região (ex.: GIF, BMP) caem no decode completo abaixo
            }
        }

        val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size, decodeOpts)
            ?: throw ImageLoadException("Não foi possível decodificar a imagem (formato inválido ou corrompido): $uri")

        if (!partial) {
            return LoadedImage(bitmap, 0, 0, bitmap.width, bitmap.height)
        }

        val scaleX = bitmap.width.toDouble() / width
        val scaleY = bitmap.height.toDouble() / height
        val scaledLeft = (left * scaleX).toInt().coerceIn(0, bitmap.width - 1)
        val scaledTop = (top * scaleY).toInt().coerceIn(0, bitmap.height - 1)
        val scaledRight = Math.ceil(right * scaleX).toInt().coerceIn(scaledLeft + 1, bitmap.width)
        val scaledBottom = Math.ceil(bottom * scaleY).toInt().coerceIn(scaledTop + 1, bitmap.height)
        return LoadedImage(bitmap, scaledLeft, scaledTop, scaledRight, scaledBottom)
    }

    private fun readBytes(context: Context, uri: String): ByteArray {
        try {
            return when {
                uri.startsWith("data:") -> {
                    val base64Part = uri.substringAfter("base64,", "")
                    if (base64Part.isEmpty()) throw ImageLoadException("data URI inválida (sem 'base64,')")
                    Base64.decode(base64Part, Base64.DEFAULT)
                }
                uri.startsWith("http://") || uri.startsWith("https://") -> fetchHttp(uri)
                uri.startsWith("content://") -> {
                    context.contentResolver.openInputStream(Uri.parse(uri))?.use { it.readAllBytesCompat() }
                        ?: throw ImageLoadException("Não foi possível abrir content URI: $uri")
                }
                uri.startsWith("file://") -> {
                    context.contentResolver.openInputStream(Uri.parse(uri))?.use { it.readAllBytesCompat() }
                        ?: java.io.File(Uri.parse(uri).path ?: uri).readBytes()
                }
                else -> {
                    // caminho absoluto de arquivo "cru", sem esquema
                    java.io.File(uri).readBytes()
                }
            }
        } catch (e: ImageLoadException) {
            throw e
        } catch (e: Exception) {
            throw ImageLoadException("Não foi possível ler a imagem: $uri (${e.message})", e)
        }
    }

    /**
     * Download HTTP/HTTPS explícito, com User-Agent (algumas CDNs, incluindo
     * o Vercel Blob Storage, bloqueiam/retornam erro para requisições sem um
     * User-Agent "de navegador"), timeout, checagem de status e seguimento
     * manual de redirect. Sem isso, `URL.openStream()` falha silenciosamente
     * com uma `FileNotFoundException` cuja mensagem é só a URL — foi
     * exatamente esse erro genérico que você viu, e não tinha nada a ver
     * com CORS (CORS é uma restrição de navegador; não existe no Kotlin).
     */
    private fun fetchHttp(uri: String, redirectsLeft: Int = 5): ByteArray {
        val connection = URL(uri).openConnection() as HttpURLConnection
        try {
            connection.instanceFollowRedirects = true
            connection.connectTimeout = 15_000
            connection.readTimeout = 15_000
            connection.setRequestProperty(
                "User-Agent",
                "Mozilla/5.0 (Linux; Android) ExpoColorThiefNative/1.0"
            )
            connection.setRequestProperty("Accept", "image/*,*/*;q=0.8")

            val code = connection.responseCode

            if (code in 300..399) {
                if (redirectsLeft <= 0) {
                    throw ImageLoadException("Muitos redirecionamentos ao baixar imagem: $uri")
                }
                val location = connection.getHeaderField("Location")
                    ?: throw ImageLoadException("Redirect (HTTP $code) sem header Location: $uri")
                return fetchHttp(location, redirectsLeft - 1)
            }

            if (code !in 200..299) {
                throw ImageLoadException("Falha ao baixar imagem (HTTP $code): $uri")
            }

            return connection.inputStream.use { it.readAllBytesCompat() }
        } catch (e: ImageLoadException) {
            throw e
        } catch (e: Exception) {
            throw ImageLoadException("Erro de rede ao baixar imagem: $uri (${e.message})", e)
        } finally {
            connection.disconnect()
        }
    }

    private fun InputStream.readAllBytesCompat(): ByteArray {
        val out = ByteArrayOutputStream()
        val buffer = ByteArray(16 * 1024)
        while (true) {
            val n = read(buffer)
            if (n < 0) break
            out.write(buffer, 0, n)
        }
        return out.toByteArray()
    }

    /**
     * Lê os pixels da área de interesse (grade 2D, uma linha por vez, sem
     * alocar o bitmap inteiro como IntArray) e já acumula direto no histograma
     * do espaço pedido — sem criar um objeto por pixel.
     *
     * `quality` é o passo da amostragem (1 = todo pixel) e `strideMultiplier`
     * só é usado pelos passes grosseiros do modo progressivo.
     */
    fun fill(
        image: LoadedImage,
        quality: Int,
        strideMultiplier: Int,
        ignoreWhite: Boolean,
        colorSpace: String,
        cancelled: AtomicBoolean
    ): MMCQ.Histogram {
        val histogram = MMCQ.Histogram()
        val oklab = colorSpace == "oklch"
        val width = image.right - image.left
        val stride = Math.sqrt(quality.toDouble()).toInt().coerceAtLeast(1) * strideMultiplier
        val row = IntArray(width)

        var y = image.top
        while (y < image.bottom) {
            if (cancelled.get()) throw ExtractionCancelled()
            image.bitmap.getPixels(row, 0, width, image.left, y, width, 1)

            var x = 0
            while (x < width) {
                val pixel = row[x]
                if ((pixel ushr 24) >= 125) {
                    val r = (pixel shr 16) and 255
                    val g = (pixel shr 8) and 255
                    val b = pixel and 255

                    if (ignoreWhite && r > 250 && g > 250 && b > 250) {
                        histogram.whiteSkipped++
                    } else {
                        val index = if (oklab) {
                            val lr = linearLut[r]
                            val lg = linearLut[g]
                            val lb = linearLut[b]
                            val l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
                            val m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
                            val s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
                            val lightness = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
                            val a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
                            val bAxis = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
                            // Células isotrópicas de 1/32 em cada eixo do OKLab (a e b só
                            // ocupam ~17 das 32 posições dentro do gamut sRGB).
                            val lq = (lightness * 32).toInt().coerceIn(0, 31)
                            val aq = ((a + 0.25) * 32).toInt().coerceIn(0, 31)
                            val bq = ((bAxis + 0.32) * 32).toInt().coerceIn(0, 31)
                            (lq shl 10) or (aq shl 5) or bq
                        } else {
                            ((r shr 3) shl 10) or ((g shr 3) shl 5) or (b shr 3)
                        }

                        histogram.counts[index]++
                        histogram.sumR[index] += r
                        histogram.sumG[index] += g
                        histogram.sumB[index] += b
                        histogram.total++
                    }
                }
                x += stride
            }
            y += stride
        }
        return histogram
    }
}
