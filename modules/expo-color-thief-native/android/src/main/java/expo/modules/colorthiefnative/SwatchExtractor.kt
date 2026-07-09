package expo.modules.colorthiefnative

import kotlin.math.abs

/**
 * Heurística de seleção de swatches semânticos, no mesmo espírito do
 * androidx.palette.graphics.Palette (Target Vibrant, Muted, Dark e Light):
 * cada target define faixas-alvo de saturação e luminosidade (HSL) e pesos
 * para saturação/luminosidade/população; escolhemos, entre as caixas que o
 * MMCQ já gerou, a que melhor pontua em cada target — sem reprocessar pixels,
 * então é praticamente grátis depois da quantização.
 */
object SwatchExtractor {

    private data class Target(
        val name: String,
        val minSat: Double, val targetSat: Double, val maxSat: Double,
        val minLum: Double, val targetLum: Double, val maxLum: Double,
        val weightSat: Double = 0.24, val weightLum: Double = 0.52, val weightPop: Double = 0.24
    )

    private val TARGETS = listOf(
        Target("Vibrant", 0.35, 1.0, 1.0, 0.30, 0.50, 0.70),
        Target("LightVibrant", 0.35, 1.0, 1.0, 0.55, 0.74, 1.0),
        Target("DarkVibrant", 0.35, 1.0, 1.0, 0.0, 0.26, 0.45),
        Target("Muted", 0.0, 0.30, 0.40, 0.30, 0.50, 0.70),
        Target("LightMuted", 0.0, 0.30, 0.40, 0.55, 0.74, 1.0),
        Target("DarkMuted", 0.0, 0.30, 0.40, 0.0, 0.26, 0.45)
    )

    data class Candidate(val r: Int, val g: Int, val b: Int, val population: Int, val h: Double, val s: Double, val l: Double)

    fun extract(boxes: List<MMCQ.VBox>): Map<String, MMCQ.VBox> {
        if (boxes.isEmpty()) return emptyMap()

        val candidates = boxes.map { box ->
            val rgb = box.avgRgb()
            val hsl = ColorMath.rgbToHsl(rgb[0], rgb[1], rgb[2])
            Triple(box, rgb, hsl)
        }
        val maxPopulation = boxes.maxOf { it.population() }.coerceAtLeast(1)

        val usedBoxes = HashSet<MMCQ.VBox>()
        val result = LinkedHashMap<String, MMCQ.VBox>()

        for (target in TARGETS) {
            var bestBox: MMCQ.VBox? = null
            var bestScore = -1.0

            for ((box, _, hsl) in candidates) {
                if (box in usedBoxes) continue
                val s = hsl[1]
                val l = hsl[2]
                if (s < target.minSat || s > target.maxSat) continue
                if (l < target.minLum || l > target.maxLum) continue

                val satScore = 1.0 - abs(s - target.targetSat)
                val lumScore = 1.0 - abs(l - target.targetLum)
                val popScore = box.population().toDouble() / maxPopulation
                val score = target.weightSat * satScore + target.weightLum * lumScore + target.weightPop * popScore

                if (score > bestScore) {
                    bestScore = score
                    bestBox = box
                }
            }

            if (bestBox != null) {
                result[target.name] = bestBox
                usedBoxes.add(bestBox)
            }
        }
        return result
    }
}
