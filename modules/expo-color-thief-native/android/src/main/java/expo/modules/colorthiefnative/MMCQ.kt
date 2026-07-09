package expo.modules.colorthiefnative

import java.util.PriorityQueue
import kotlin.math.max
import kotlin.math.min

/**
 * Port em Kotlin do MMCQ usado pelo color-thief (lokesh) e color-thief-java
 * (SvenWoltmann), generalizado para rodar tanto no cubo RGB clássico quanto
 * num cubo perceptual (OKLab) — usado quando `colorSpace = "oklch"`.
 *
 * Ideia: cada pixel amostrado entra com (a) coordenadas de "bucket" de 5 bits
 * (0-31) por canal — usadas só para construir o histograma e cortar caixas —
 * e (b) sua cor sRGB original, que é o que de fato é somado/mediado dentro
 * de cada caixa final. Isso mantém a mesma implementação de median-cut para
 * os dois espaços, e garante que a cor de saída seja sempre um sRGB válido.
 */
object MMCQ {

    private const val SIGBITS = 5
    private const val RSHIFT = 8 - SIGBITS
    private const val MAX_ITERATIONS = 1000
    private const val FRACT_BY_POPULATIONS = 0.75

    data class Sample(
        val bucketA: Int,
        val bucketB: Int,
        val bucketC: Int,
        val srcR: Int,
        val srcG: Int,
        val srcB: Int
    )

    class VBox(
        var a1: Int, var a2: Int,
        var b1: Int, var b2: Int,
        var c1: Int, var c2: Int,
        private val histo: HashMap<Long, Int>,
        private val sumR: HashMap<Long, Long>,
        private val sumG: HashMap<Long, Long>,
        private val sumB: HashMap<Long, Long>
    ) {
        private var populationCache: Int = -1

        private fun key(a: Int, b: Int, c: Int): Long =
            (a.toLong() shl 20) or (b.toLong() shl 10) or c.toLong()

        fun volume(): Int = (a2 - a1 + 1) * (b2 - b1 + 1) * (c2 - c1 + 1)

        fun population(): Int {
            if (populationCache >= 0) return populationCache
            var count = 0
            for (a in a1..a2) for (b in b1..b2) for (c in c1..c2) {
                count += histo[key(a, b, c)] ?: 0
            }
            populationCache = count
            return count
        }

        /** Cor média (sRGB real, não a coordenada de bucket) dos pixels na caixa. */
        fun avgRgb(): IntArray {
            var r = 0L; var g = 0L; var b = 0L; var n = 0L
            for (a in a1..a2) for (bb in b1..b2) for (c in c1..c2) {
                val k = key(a, bb, c)
                val cnt = histo[k] ?: 0
                if (cnt == 0) continue
                r += sumR[k] ?: 0L
                g += sumG[k] ?: 0L
                b += sumB[k] ?: 0L
                n += cnt
            }
            if (n == 0L) return intArrayOf(0, 0, 0)
            return intArrayOf((r / n).toInt(), (g / n).toInt(), (b / n).toInt())
        }

        fun copy() = VBox(a1, a2, b1, b2, c1, c2, histo, sumR, sumG, sumB)
    }

    /**
     * @param samples pixels já convertidos para o espaço de bucket desejado
     * @param maxColors número alvo de cores (colorCount)
     * @return lista de VBox, uma por cor final, ordenada por população desc.
     */
    fun quantize(samples: List<Sample>, maxColors: Int): List<VBox> {
        if (samples.isEmpty() || maxColors < 2) return emptyList()

        val histo = HashMap<Long, Int>()
        val sumR = HashMap<Long, Long>()
        val sumG = HashMap<Long, Long>()
        val sumB = HashMap<Long, Long>()

        var a1 = Int.MAX_VALUE; var a2 = Int.MIN_VALUE
        var b1 = Int.MAX_VALUE; var b2 = Int.MIN_VALUE
        var c1 = Int.MAX_VALUE; var c2 = Int.MIN_VALUE

        for (s in samples) {
            val k = (s.bucketA.toLong() shl 20) or (s.bucketB.toLong() shl 10) or s.bucketC.toLong()
            histo[k] = (histo[k] ?: 0) + 1
            sumR[k] = (sumR[k] ?: 0L) + s.srcR
            sumG[k] = (sumG[k] ?: 0L) + s.srcG
            sumB[k] = (sumB[k] ?: 0L) + s.srcB

            if (s.bucketA < a1) a1 = s.bucketA
            if (s.bucketA > a2) a2 = s.bucketA
            if (s.bucketB < b1) b1 = s.bucketB
            if (s.bucketB > b2) b2 = s.bucketB
            if (s.bucketC < c1) c1 = s.bucketC
            if (s.bucketC > c2) c2 = s.bucketC
        }

        val rootBox = VBox(a1, a2, b1, b2, c1, c2, histo, sumR, sumG, sumB)

        // fila 1: corta priorizando as maiores caixas por população
        val pq1 = PriorityQueue<VBox>(compareBy { it.population() })
        pq1.add(rootBox)

        iterate(pq1, FRACT_BY_POPULATIONS * maxColors, histo)

        // fila 2: agora prioriza população * volume (caixas "densas e grandes")
        val pq2 = PriorityQueue<VBox>(compareBy { it.population() * it.volume() })
        pq2.addAll(pq1)

        iterate(pq2, maxColors.toDouble() - pq1.size, histo)

        val result = ArrayList<VBox>(pq2)
        result.sortByDescending { it.population() }
        return result
    }

    private fun iterate(queue: PriorityQueue<VBox>, target: Double, histo: HashMap<Long, Int>) {
        var iterations = 0
        var lastSize = queue.size
        while (queue.size < target && iterations < MAX_ITERATIONS) {
            iterations++
            val vbox = queue.poll() ?: return
            if (vbox.population() == 0) {
                if (vbox.volume() > 0) queue.add(vbox)
                continue
            }
            val split = medianCutApply(vbox, histo)
            if (split == null) {
                queue.add(vbox)
                continue
            }
            queue.add(split.first)
            split.second?.let { queue.add(it) }
            if (queue.size == lastSize) {
                // não conseguiu mais dividir nada -> evita loop infinito
                break
            }
            lastSize = queue.size
        }
    }

    private fun medianCutApply(vbox: VBox, histo: HashMap<Long, Int>): Pair<VBox, VBox?>? {
        if (vbox.population() == 0) return null

        val rw = vbox.a2 - vbox.a1 + 1
        val gw = vbox.b2 - vbox.b1 + 1
        val bw = vbox.c2 - vbox.c1 + 1
        val maxW = max(rw, max(gw, bw))
        if (vbox.a2 == vbox.a1 && vbox.b2 == vbox.b1 && vbox.c2 == vbox.c1) return null

        // eixo de corte = maior dimensão
        val axis = when (maxW) {
            rw -> 'a'
            gw -> 'b'
            else -> 'c'
        }

        // soma acumulada de população ao longo do eixo, pra achar o ponto médio
        val partialSum = HashMap<Int, Int>()
        var total = 0
        val (lo, hi) = when (axis) {
            'a' -> vbox.a1 to vbox.a2
            'b' -> vbox.b1 to vbox.b2
            else -> vbox.c1 to vbox.c2
        }

        for (i in lo..hi) {
            var sum = 0
            when (axis) {
                'a' -> for (bb in vbox.b1..vbox.b2) for (c in vbox.c1..vbox.c2) {
                    sum += histo[(i.toLong() shl 20) or (bb.toLong() shl 10) or c.toLong()] ?: 0
                }
                'b' -> for (a in vbox.a1..vbox.a2) for (c in vbox.c1..vbox.c2) {
                    sum += histo[(a.toLong() shl 20) or (i.toLong() shl 10) or c.toLong()] ?: 0
                }
                else -> for (a in vbox.a1..vbox.a2) for (bb in vbox.b1..vbox.b2) {
                    sum += histo[(a.toLong() shl 20) or (bb.toLong() shl 10) or i.toLong()] ?: 0
                }
            }
            total += sum
            partialSum[i] = total
        }
        if (total == 0) return null

        var cutPoint = lo
        val half = total / 2
        for (i in lo..hi) {
            if ((partialSum[i] ?: 0) > half) { cutPoint = i; break }
        }

        val box1 = vbox.copy()
        val box2 = vbox.copy()
        when (axis) {
            'a' -> { box1.a2 = cutPoint; box2.a1 = min(cutPoint + 1, vbox.a2) }
            'b' -> { box1.b2 = cutPoint; box2.b1 = min(cutPoint + 1, vbox.b2) }
            else -> { box1.c2 = cutPoint; box2.c1 = min(cutPoint + 1, vbox.c2) }
        }
        if (box1.population() == 0 || box2.population() == 0) return null
        return box1 to box2
    }
}
