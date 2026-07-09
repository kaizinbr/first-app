package expo.modules.colorthiefnative

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Base64
import expo.modules.kotlin.exception.CodedException
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import kotlin.math.max
import kotlin.math.min

/**
 * Erro descritivo para qualquer falha no carregamento/decodificação da
 * imagem. Estende `CodedException` do Expo Modules API, então chega no JS
 * já como um `CodedError` com mensagem legível (em vez de uma mensagem
 * genérica só com a URL).
 */
class ImageLoadException(message: String, cause: Throwable? = null) :
    CodedException(message, cause)

/**
 * Carrega a imagem já reduzida (inSampleSize) para não gastar memória/tempo
 * decodificando um bitmap gigante que depois seria amostrado — é o maior
 * ganho de performance disponível, muito mais impactante que otimizar o
 * loop de quantização em si.
 */
object ImageSampler {

    /** Lado máximo do bitmap decodificado. 300px é mais que suficiente para
     *  extração de cor e paletas — imagens maiores só desperdiçam CPU. */
    private const val MAX_DECODE_DIMENSION = 300

    fun loadBitmap(context: Context, uri: String): Bitmap {
        val bytes = readBytes(context, uri)

        val boundsOpts = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        BitmapFactory.decodeByteArray(bytes, 0, bytes.size, boundsOpts)

        val sampleSize = calculateInSampleSize(boundsOpts.outWidth, boundsOpts.outHeight)
        val decodeOpts = BitmapFactory.Options().apply {
            inSampleSize = sampleSize
            inPreferredConfig = Bitmap.Config.ARGB_8888
        }
        return BitmapFactory.decodeByteArray(bytes, 0, bytes.size, decodeOpts)
            ?: throw ImageLoadException("Não foi possível decodificar a imagem (formato inválido ou corrompido): $uri")
    }

    private fun calculateInSampleSize(width: Int, height: Int): Int {
        var inSampleSize = 1
        val largestSide = max(width, height)
        while (largestSide / inSampleSize > MAX_DECODE_DIMENSION) {
            inSampleSize *= 2
        }
        return inSampleSize
    }

    private fun readBytes(context: Context, uri: String): ByteArray {
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
     * Extrai os pixels amostrados (respeitando `quality` e `ignoreWhite`) já
     * como MMCQ.Sample, no espaço de bucket pedido (rgb ou oklch).
     */
    fun sample(bitmap: Bitmap, quality: Int, ignoreWhite: Boolean, colorSpace: String): List<MMCQ.Sample> {
        val q = max(1, min(10, quality))
        val width = bitmap.width
        val height = bitmap.height
        val pixels = IntArray(width * height)
        bitmap.getPixels(pixels, 0, width, 0, 0, width, height)

        val samples = ArrayList<MMCQ.Sample>(pixels.size / q + 1)
        var i = 0
        while (i < pixels.size) {
            val pixel = pixels[i]
            val a = (pixel ushr 24) and 0xFF
            if (a >= 125) {
                val r = (pixel ushr 16) and 0xFF
                val g = (pixel ushr 8) and 0xFF
                val b = pixel and 0xFF

                val isWhiteish = r > 250 && g > 250 && b > 250
                if (!(ignoreWhite && isWhiteish)) {
                    samples.add(toSample(r, g, b, colorSpace))
                }
            }
            i += q
        }
        return samples
    }

    private fun toSample(r: Int, g: Int, b: Int, colorSpace: String): MMCQ.Sample {
        return if (colorSpace == "oklch") {
            val lab = ColorMath.rgbToOklab(r, g, b)
            // Faixas práticas de OKLab: L em [0,1], a/b aprox em [-0.4, 0.4]
            val bucketA = clampBucket(((lab[0]) * 31).toInt())
            val bucketB = clampBucket((((lab[1] + 0.4) / 0.8) * 31).toInt())
            val bucketC = clampBucket((((lab[2] + 0.4) / 0.8) * 31).toInt())
            MMCQ.Sample(bucketA, bucketB, bucketC, r, g, b)
        } else {
            MMCQ.Sample(r shr 3, g shr 3, b shr 3, r, g, b) // 5 bits (0-31), igual ao MMCQ clássico
        }
    }

    private fun clampBucket(v: Int) = max(0, min(31, v))
}
