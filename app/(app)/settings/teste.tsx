import { EnrichedMarkdownText } from "react-native-enriched-markdown";
import {
    Linking,
    StyleSheet,
    View,
    Pressable,
    ActivityIndicator,
} from "react-native";

import { authClient } from "@/lib/auth-client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TextDefault from "@/components/core/text-core";
import { useRouter, Href, Link } from "expo-router";

import { apiAuth, apiAuthDELETE } from "@/lib/api";
import { Image } from "expo-image";

import { Comment } from "@/lib/types";
import { displayPastRelativeTime, getPastRelativeTime } from "@/lib/util/time";

import {
    Flag,
    ForbiddenCircle,
    MenuDots,
    Pen,
    TrashBinTrash,
    User,
    Vinyl,
} from "@solar-icons/react-native/Bold";
import {
    ChatRound,
    ChatSquare,
    Share,
} from "@solar-icons/react-native/Outline";

import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";

import ConfirmModal from "@/components/core/confirm-modal";
import { ShareLargeBtn, ShareSmBtn } from "@/components/core/share-btn";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LikeCommentButton } from "@/components/reviews/like-btn";

const markdown = `
**Teste negrito** *italico* e normal aaaaa ***e os dois***
`;

export default function CommentCard() {
    const markdownContent = `# LIKE JENNIE — Avaliação do Álbum

## Visão Geral

**LIKE JENNIE** é o álbum de estreia solo de *Jennie Kim*, lançado em 2025. Com produção impecável e uma identidade sonora própria, o projeto consolida sua posição como uma das artistas mais relevantes do K-pop atual.

---

## Faixas em Destaque

### 1. Mantra

A faixa de abertura define o tom do álbum: **confiante**, *provocativa* e absolutamente elegante. O beat minimalista contrasta com a entrega vocal de Jennie — uma combinação que só ela consegue fazer funcionar.

### 2. Love Hangover

Uma viagem ao R&B dos anos 90 com produção moderna. A ponte da música tem um momento de ***bold italic*** que literalmente para o tempo.

### 3. ExtraL

> "Se você não entendeu ExtraL na primeira escuta, ouça de novo. E de novo. E de novo."
>
> > Há camadas aqui que levam semanas para se revelar completamente — desde os samples escondidos até a letra que flerta com a autossabotagem.

---

## Produção

O álbum conta com colaboração de produtores como  — nomes que sozinhos já garantem qualidade. O processo de produção seguiu uma lógica clara:

1. Definir a identidade sonora antes das faixas
2. Gravar vocais em múltiplos países
3. Revisitar e reeditar com base no feedback da própria Jennie
   1. Sessões extras em Los Angeles
   2. Mixagem final em Seul

---

## Pontos Fortes

- **Coesão sonora** — cada faixa soa como parte de um todo
- **Direção artística** — Jennie co-dirigiu a maioria dos videoclipes
  - Paleta visual consistente
  - Referências ao cinema francês e à moda haute couture
- **Letras** — em inglês e coreano, com camadas de significado
  - Empoderamento feminino sem clichês
  - Vulnerabilidade real misturada com atitude

---

## Checklist de Escuta

- [x] Ouvir o álbum completo sem pular faixas
- [x] Prestar atenção nas letras de *ExtraL*
- [ ] Assistir todos os videoclipes na ordem
- [ ] Ler as anotações do encarte físico

---

## Comparativo com Outros Solos do BLACKPINK

| Álbum | Artista | Ano | Estilo Principal | Nota |
|---|---|---|---|---|
| LIKE JENNIE | Jennie | 2025 | Pop / R&B | ★★★★★ |
| R | Rosé | 2025 | Indie Pop | ★★★★☆ |
| IM NAYEON | Nayeon | 2022 | Pop Coreano | ★★★☆☆ |

---

## Trecho Favorito (Mantra)

> A letra de Mantra é um manifesto. Jennie não pede permissão — ela declara.

O refrão usa uma estrutura rítmica baseada em call and response que remete ao gospel americano, mas com uma entrega completamente contemporânea.

---

## Nota Final

||Jennie merecia mais do que o mundo estava disposto a dar durante os anos de BLACKPINK. LIKE JENNIE é a prova de que ela sempre soube disso.||

Este álbum é um **marco** na história do K-pop solo feminino. É ousado, é pessoal e, acima de tudo, é inegavelmente *Jennie*.

**Nota:** 9.4/10

---

*Avaliação escrita por @kaio • plataforma de reviews musicais*`;

    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
        padding: 16,
    },
    text: {
        flex: 1,
        fontSize: 15,
        color: "#fff",
        maxHeight: 100, // limita a altura máxima
        minHeight: 28,
    },
    main: {
        width: "100%",
        backgroundColor: "transparent",
        borderRadius: 8,
    },
    mainPressed: {
        backgroundColor: "#1e1e1e",
    },
    card: {
        width: "100%",
        flex: 1,
        backgroundColor: "transparent",
        color: "#eee",
        paddingHorizontal: 16,
        paddingTop: 160,
        paddingBottom: 8,
        borderRadius: 8,
        flexDirection: "row",
        gap: 8,
    },
    cardImage: {
        width: 40,
        height: 40,
        backgroundColor: "#bbb",
        borderRadius: 40 * 0.306,
        marginBottom: 8,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: 500,
        color: "#eee",
        marginTop: 4,
        fontSize: 14,
        // wordWrap: "break-word",
    },
    albumSection: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 12,
        color: "#eee",
        padding: 12,
        backgroundColor: "#1e1e1e",
        borderRadius: 8,
        borderColor: "#333",
        borderWidth: 0.5,
    },
    albumSectionValue: {
        fontWeight: 900,
        color: "#eee",
        fontSize: 20,
    },
    albumSectionText: {
        color: "#eee",
        fontSize: 12,
        marginTop: 6,
    },
    cardDate: {
        marginTop: 8,
        color: "#aaa",
        fontSize: 12,
    },
    readMore: {
        marginTop: 8,
        color: "#8065ef",
        fontSize: 14,
        fontWeight: "bold",
    },

    sheetView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
    },
    optBtn: {
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "transparent",
        padding: 12,
        width: "100%",
        borderRadius: 8,
    },
    optText: {
        color: "#eee",
        fontSize: 14,
        marginLeft: 12,
    },
    extraInfo: {
        color: "#777",
        fontSize: 14,
    },
    buttonSection: {
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
});
