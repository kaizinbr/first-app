package expo.modules.colorthiefnative

/**
 * Median cut (MMCQ) do color-thief, rodando sobre um histograma em array
 * (32x32x32 = 32768 células, 5 bits por eixo) em vez de HashMap com boxing.
 *
 * O mesmo cubo serve para os dois espaços: em "rgb" os eixos são R, G, B; em
 * "oklch" os eixos são L, a, b do OKLab (coordenadas retangulares do OKLCH,
 * porque o matiz é circular e quebraria o corte pela mediana). Em ambos os
 * casos cada célula guarda a soma do sRGB original dos pixels que caíram
 * nela, então a cor final de cada caixa é a média real dos pixels.
 */
object MMCQ {

    class Histogram {
        val counts = IntArray(32768)
        val sumR = IntArray(32768)
        val sumG = IntArray(32768)
        val sumB = IntArray(32768)

        /** Pixels contabilizados (já sem os transparentes/brancos ignorados). */
        var total = 0

        /** Pixels quase brancos descartados por `ignoreWhite`. */
        var whiteSkipped = 0
    }

    class VBox(
        private val histogram: Histogram,
        val a1: Int, val a2: Int,
        val b1: Int, val b2: Int,
        val c1: Int, val c2: Int
    ) {
        private val population: Int

        init {
            var sum = 0
            for (a in a1..a2) {
                for (b in b1..b2) {
                    for (c in c1..c2) {
                        sum += histogram.counts[(a shl 10) or (b shl 5) or c]
                    }
                }
            }
            population = sum
        }

        fun population(): Int = population

        fun volume(): Int = (a2 - a1 + 1) * (b2 - b1 + 1) * (c2 - c1 + 1)

        /** Cor média (sRGB real, não a coordenada da célula) dos pixels na caixa. */
        fun avgRgb(): IntArray {
            var r = 0L
            var g = 0L
            var b = 0L
            var n = 0L
            for (x in a1..a2) {
                for (y in b1..b2) {
                    for (z in c1..c2) {
                        val index = (x shl 10) or (y shl 5) or z
                        val count = histogram.counts[index]
                        if (count == 0) continue
                        r += histogram.sumR[index]
                        g += histogram.sumG[index]
                        b += histogram.sumB[index]
                        n += count
                    }
                }
            }
            if (n == 0L) return intArrayOf(0, 0, 0)
            return intArrayOf(
                Math.round(r.toDouble() / n).toInt(),
                Math.round(g.toDouble() / n).toInt(),
                Math.round(b.toDouble() / n).toInt()
            )
        }
    }

    /**
     * @param maxColors número alvo de cores (colorCount)
     * @return caixas finais, ordenadas por população decrescente
     */
    fun quantize(histogram: Histogram, maxColors: Int): List<VBox> {
        if (histogram.total == 0 || maxColors < 2) return emptyList()

        var a1 = 31
        var a2 = 0
        var b1 = 31
        var b2 = 0
        var c1 = 31
        var c2 = 0
        var found = false

        for (index in 0 until 32768) {
            if (histogram.counts[index] == 0) continue
            found = true
            val a = index shr 10
            val b = (index shr 5) and 31
            val c = index and 31
            if (a < a1) a1 = a
            if (a > a2) a2 = a
            if (b < b1) b1 = b
            if (b > b2) b2 = b
            if (c < c1) c1 = c
            if (c > c2) c2 = c
        }
        if (!found) return emptyList()

        val open = mutableListOf(VBox(histogram, a1, a2, b1, b2, c1, c2))
        val locked = mutableListOf<VBox>()

        // 1ª fase: corta sempre a caixa mais populosa (75% das cores)
        iterate(histogram, open, locked, maxColors * 0.75, false)
        // 2ª fase: passa a priorizar população * volume
        iterate(histogram, open, locked, maxColors.toDouble(), true)

        val result = ArrayList<VBox>(open.size + locked.size)
        result.addAll(open)
        result.addAll(locked)
        result.sortByDescending { it.population() }
        return result
    }

    private fun iterate(
        histogram: Histogram,
        open: MutableList<VBox>,
        locked: MutableList<VBox>,
        target: Double,
        byVolume: Boolean
    ) {
        while (open.isNotEmpty() && open.size + locked.size < target) {
            var best = 0
            var bestKey = -1L
            for (i in open.indices) {
                val box = open[i]
                val key = if (byVolume) box.population().toLong() * box.volume() else box.population().toLong()
                if (key > bestKey) {
                    bestKey = key
                    best = i
                }
            }

            val box = open.removeAt(best)
            val split = medianCut(histogram, box)
            if (split == null) {
                // caixa indivisível (1 pixel ou 1 célula): sai da fila de cortes
                locked.add(box)
                continue
            }
            open.add(split.first)
            open.add(split.second)
        }
    }

    private fun medianCut(histogram: Histogram, box: VBox): Pair<VBox, VBox>? {
        if (box.population() <= 1) return null

        val widths = intArrayOf(box.a2 - box.a1 + 1, box.b2 - box.b1 + 1, box.c2 - box.c1 + 1)

        // Tenta primeiro o eixo mais largo (igual ao MMCQ original); se todos os
        // pixels estiverem numa única fatia dele, tenta os outros eixos.
        val axes = listOf(0, 1, 2).sortedByDescending { widths[it] }
        for (axis in axes) {
            if (widths[axis] < 2) continue
            val split = cutAlongAxis(histogram, box, axis)
            if (split != null) return split
        }
        return null
    }

    private fun cutAlongAxis(histogram: Histogram, box: VBox, axis: Int): Pair<VBox, VBox>? {
        val lo = when (axis) {
            0 -> box.a1
            1 -> box.b1
            else -> box.c1
        }
        val hi = when (axis) {
            0 -> box.a2
            1 -> box.b2
            else -> box.c2
        }

        val partial = IntArray(32)
        val lookahead = IntArray(32)
        var total = 0

        for (i in lo..hi) {
            var sum = 0
            when (axis) {
                0 -> for (b in box.b1..box.b2) for (c in box.c1..box.c2) sum += histogram.counts[(i shl 10) or (b shl 5) or c]
                1 -> for (a in box.a1..box.a2) for (c in box.c1..box.c2) sum += histogram.counts[(a shl 10) or (i shl 5) or c]
                else -> for (a in box.a1..box.a2) for (b in box.b1..box.b2) sum += histogram.counts[(a shl 10) or (b shl 5) or i]
            }
            total += sum
            partial[i] = total
        }
        for (i in lo..hi) lookahead[i] = total - partial[i]

        for (i in lo..hi) {
            if (partial[i] * 2 <= total) continue

            val left = i - lo
            val right = hi - i
            var cut = if (left <= right) {
                minOf(hi - 1, (i + right / 2.0).toInt())
            } else {
                maxOf(lo, (i - 1 - left / 2.0).toInt())
            }

            // evita caixas vazias
            while (partial[cut] == 0 && cut < hi) cut++
            var rest = lookahead[cut]
            while (rest == 0 && cut > lo && partial[cut - 1] != 0) {
                cut--
                rest = lookahead[cut]
            }
            if (cut >= hi) return null

            val first: VBox
            val second: VBox
            when (axis) {
                0 -> {
                    first = VBox(histogram, box.a1, cut, box.b1, box.b2, box.c1, box.c2)
                    second = VBox(histogram, cut + 1, box.a2, box.b1, box.b2, box.c1, box.c2)
                }
                1 -> {
                    first = VBox(histogram, box.a1, box.a2, box.b1, cut, box.c1, box.c2)
                    second = VBox(histogram, box.a1, box.a2, cut + 1, box.b2, box.c1, box.c2)
                }
                else -> {
                    first = VBox(histogram, box.a1, box.a2, box.b1, box.b2, box.c1, cut)
                    second = VBox(histogram, box.a1, box.a2, box.b1, box.b2, cut + 1, box.c2)
                }
            }
            if (first.population() == 0 || second.population() == 0) return null
            return Pair(first, second)
        }
        return null
    }
}
