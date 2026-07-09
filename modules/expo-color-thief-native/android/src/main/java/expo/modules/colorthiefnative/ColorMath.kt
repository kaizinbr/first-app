package expo.modules.colorthiefnative

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import kotlin.math.atan2
import kotlin.math.cbrt
import kotlin.math.max
import kotlin.math.min
import kotlin.math.pow
import kotlin.math.sqrt

/**
 * Toda a matemática de cor fica isolada aqui, sem dependência de Android
 * Bitmap, para ficar fácil de testar isoladamente (JUnit puro em JVM).
 */
object ColorMath {

    // ---------- sRGB <-> linear ----------

    private fun srgbToLinear(c: Double): Double =
        if (c <= 0.04045) c / 12.92 else ((c + 0.055) / 1.055).pow(2.4)

    private fun linearToSrgb(c: Double): Double =
        if (c <= 0.0031308) c * 12.92 else 1.055 * c.pow(1.0 / 2.4) - 0.055

    // ---------- sRGB(0-255) <-> OKLab ----------
    // Matrizes de Björn Ottosson (https://bottosson.github.io/posts/oklab/)

    fun rgbToOklab(r: Int, g: Int, b: Int): DoubleArray {
        val lr = srgbToLinear(r / 255.0)
        val lg = srgbToLinear(g / 255.0)
        val lb = srgbToLinear(b / 255.0)

        val l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
        val m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
        val s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

        val l_ = cbrt(l)
        val m_ = cbrt(m)
        val s_ = cbrt(s)

        val L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
        val a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
        val bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
        return doubleArrayOf(L, a, bb)
    }

    fun oklabToRgb(L: Double, a: Double, b: Double): IntArray {
        val l_ = L + 0.3963377774 * a + 0.2158037573 * b
        val m_ = L - 0.1055613458 * a - 0.0638541728 * b
        val s_ = L - 0.0894841775 * a - 1.2914855480 * b

        val l = l_ * l_ * l_
        val m = m_ * m_ * m_
        val s = s_ * s_ * s_

        val lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
        val lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
        val lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s

        val r = (linearToSrgb(lr) * 255.0).roundClamp()
        val g = (linearToSrgb(lg) * 255.0).roundClamp()
        val bl = (linearToSrgb(lb) * 255.0).roundClamp()
        return intArrayOf(r, g, bl)
    }

    fun oklabToOklch(L: Double, a: Double, b: Double): DoubleArray {
        val c = sqrt(a * a + b * b)
        var h = Math.toDegrees(atan2(b, a))
        if (h < 0) h += 360.0
        return doubleArrayOf(L, c, h)
    }

    private fun Double.roundClamp(): Int = max(0.0, min(255.0, this)).let { Math.round(it).toInt() }

    // ---------- sRGB <-> HSL ----------

    fun rgbToHsl(r: Int, g: Int, b: Int): DoubleArray {
        val rf = r / 255.0
        val gf = g / 255.0
        val bf = b / 255.0
        val maxV = max(rf, max(gf, bf))
        val minV = min(rf, min(gf, bf))
        val l = (maxV + minV) / 2.0
        if (maxV == minV) return doubleArrayOf(0.0, 0.0, l)

        val d = maxV - minV
        val s = if (l > 0.5) d / (2.0 - maxV - minV) else d / (maxV + minV)
        val h = when (maxV) {
            rf -> (gf - bf) / d + (if (gf < bf) 6.0 else 0.0)
            gf -> (bf - rf) / d + 2.0
            else -> (rf - gf) / d + 4.0
        } * 60.0
        return doubleArrayOf(h, s, l)
    }

    // ---------- luminância relativa e contraste WCAG ----------

    fun relativeLuminance(r: Int, g: Int, b: Int): Double {
        val rl = srgbToLinear(r / 255.0)
        val gl = srgbToLinear(g / 255.0)
        val bl = srgbToLinear(b / 255.0)
        return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
    }

    fun contrastRatio(l1: Double, l2: Double): Double {
        val lighter = max(l1, l2)
        val darker = min(l1, l2)
        return (lighter + 0.05) / (darker + 0.05)
    }

    fun toHex(r: Int, g: Int, b: Int): String =
        String.format("#%02x%02x%02x", r, g, b)
}

/** Record serializável de volta pra JS (equivalente ao Color do colorthief). */
class ColorThiefColorRecord(
    r: Int,
    g: Int,
    b: Int,
    population: Int,
    totalSamples: Int
) : Record {
    @Field val r: Int = r
    @Field val g: Int = g
    @Field val b: Int = b
    @Field val hex: String = ColorMath.toHex(r, g, b)

    @Field val hsl: Map<String, Double> = ColorMath.rgbToHsl(r, g, b).let {
        mapOf("h" to it[0], "s" to it[1], "l" to it[2])
    }

    @Field val oklch: Map<String, Double> = ColorMath.rgbToOklab(r, g, b).let { lab ->
        ColorMath.oklabToOklch(lab[0], lab[1], lab[2]).let {
            mapOf("l" to it[0], "c" to it[1], "h" to it[2])
        }
    }

    @Field val population: Int = population
    @Field val proportion: Double = if (totalSamples > 0) population.toDouble() / totalSamples else 0.0

    private val luminance = ColorMath.relativeLuminance(r, g, b)
    private val contrastWhite = ColorMath.contrastRatio(luminance, 1.0)
    private val contrastBlack = ColorMath.contrastRatio(luminance, 0.0)

    @Field val isDark: Boolean = luminance < 0.5
    @Field val isLight: Boolean = !isDark
    @Field val textColor: String = if (contrastWhite >= contrastBlack) "#ffffff" else "#000000"

    @Field val contrast: Map<String, Any> = mapOf(
        "white" to contrastWhite,
        "black" to contrastBlack,
        "foreground" to textColor
    )
}
