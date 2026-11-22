import TextDefault from "@/components/core/text-core";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ColorThiefColorData } from "expo-color-thief-native";

import { selectBackgroundColor, selectAlbumColor } from "@/lib/util/selectRightColor";
import { AltArrowLeftIcon } from "@solar-icons/react-native/linear/alt-arrow-left";
import AlbumData, { AlbumExtraData } from "@/components/albuns/data";
import FavoriteAlbumBtn from "@/components/albuns/favorite-album-btn";
import AlbumHeader from "@/components/albuns/header";
import Tracklist from "@/components/albuns/tracklist";
import WishlistAlbumBtn from "@/components/albuns/wishlist-album-btn";
import FixedHeader from "@/components/core/fixed-header";
import { Album, UserProfile } from "@/lib/types";
import {
    darkenColor,
    lightenColor,
    saturateColor,
} from "@/lib/util/workWithColors";
import MoreFromArtist from "@/components/albuns/aditionals/more-from-artist";



export default function AlbumScreen({
    albumData,
    userData,
    palette,
}: {
    albumData: Album;
    userData: UserProfile;
    palette: ColorThiefColorData[];
}) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const scrollY = useSharedValue(0);

    const HEADER_MAX_HEIGHT = 420; // Tamanho total da área do gradiente
    const HEADER_MIN_HEIGHT = insets.top + 50; // Tamanho da barrinha que vai ficar fixa
    const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

    const mainColor = selectAlbumColor(palette).hex;

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    // 1. A MÁGICA DO FUNDO: Rola junto com a tela!
    const backgroundStyle = useAnimatedStyle(() => {
        // Se rolar pra baixo (scroll positivo), o fundo sobe na mesma velocidade (-scrollY)
        // Se puxar a tela pra cima (bounce negativo), ele trava no 0 para não desgrudar do topo.
        const translateY = scrollY.value > 0 ? -scrollY.value : 0;

        // Dá uma leve esticada no gradiente se o usuário puxar a tela (overscroll)
        const scale =
            scrollY.value < 0
                ? 1 + Math.abs(scrollY.value) / HEADER_MAX_HEIGHT
                : 1;

        return {
            transform: [{ translateY }, { scale }],
        };
    });

    // 2. A MÁGICA DA HEADER FIXA: Nasce quando o gradiente vai embora
    const topBarStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [SCROLL_DISTANCE - 40, SCROLL_DISTANCE], // Começa a aparecer 40px antes de bater no topo
            [0, 1],
            Extrapolation.CLAMP,
        );
        return { opacity };
    });

    // 3. Animação da Capa e Título sumindo
    const headerContentStyle = useAnimatedStyle(() => {
        // const opacity = interpolate(
        //     scrollY.value,
        //     [0, SCROLL_DISTANCE / 1.5], // Some um pouco antes da metade do caminho
        //     [1, 0],
        //     Extrapolation.CLAMP,
        // );
        const scale = interpolate(
            scrollY.value,
            [-100, 0, SCROLL_DISTANCE],
            [1.1, 1, 0.8],
            Extrapolation.CLAMP,
        );
        return { transform: [{ scale }] };
    });

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // console.log(selectAlbumColor(palette));

    return (
        <View style={styles.container}>

            <FixedHeader
                data={albumData}
                mainColor={mainColor}
                scrollY={scrollY}
                type="album"
            />

            <Animated.View
                style={[
                    animatedStyle,
                    {
                        position: "absolute",
                        left: 16,
                        right: 70,
                        bottom: insets.bottom,
                        zIndex: 11,
                        height: 46,
                        
                    },
                ]}
            >
                <Pressable
                    onPressIn={() => {
                        scale.value = withSpring(0.96);
                    }}
                    onPressOut={() => {
                        scale.value = withSpring(1);
                    }}
                    onPress={() =>
                        router.push({
                            pathname: `/(app)/create/review/tracks/[id]`,
                            params: { id: albumData.id },
                        })
                    }
                    style={styles.reviewButton}
                >
                    <TextDefault
                        style={{
                            color: "#eee",
                            fontSize: 16,
                            fontWeight: "bold",
                        }}
                    >
                        Avaliar álbum
                    </TextDefault>
                </Pressable>
            </Animated.View>

            <WishlistAlbumBtn
                albumData={albumData}
                size={30}
                mainColor={mainColor}
            />

            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <AlbumHeader
                    maxHeight={HEADER_MAX_HEIGHT}
                    data={albumData}
                />
                
                <View
                    style={{
                        position: "absolute",
                        top: HEADER_MAX_HEIGHT - 180,
                        height: 330,
                        zIndex: 1,
                        width: "100%",
                        
                    }}
                >
                    <LinearGradient
                        colors={["transparent", selectAlbumColor(palette).hex]}
                        style={{
                            height: 162,
                            width: "100%",
                        }}
                    />
                    <View style={{ height: 16, width: "100%", backgroundColor: selectAlbumColor(palette).hex }} />
                    <LinearGradient
                        colors={[selectAlbumColor(palette).hex, "transparent"]}
                        style={{
                            height: 162,
                            width: "100%",
                        }}
                    />
                </View>

                <AlbumData data={albumData}  />

                {/* <View
                    style={{
                        paddingHorizontal: 16,
                        marginTop: 24,
                        marginBottom: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <TextDefault>cores</TextDefault>
                    {palette.map((color, index) => (
                        <View
                            key={index}
                            style={{
                                width: 30,
                                height: 30,
                                backgroundColor: color.hex,
                                borderRadius: 15,
                            }}
                        />
                    ))}
                </View> */}

                <Tracklist albumTracks={albumData.tracks.items} />
                <AlbumExtraData data={albumData} />

                <MoreFromArtist data={albumData} />

                <View style={{ height: 124 }} />
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718", // Cor de fundo do resto do app
    },
    gradientContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0, // Fica atrás do ScrollView
    },
    fixedTopBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#1c494f", // Cor final da barrinha
        zIndex: 10,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    fixedTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        borderRadius: 999,
        
        backgroundColor: "rgba(22,23,24,0.7)",
        alignItems: "center",
        justifyContent: "center",
    },
    favoriteBtn: {
        position: "absolute",
        right: 16,
        zIndex: 11,
        width: 40,
        height: 40,
                backgroundColor: "rgba(22,23,24,0.7)",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
    },
    reviewButton: {
        height: 46,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#8065ef",
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    fav: {
        position: "absolute",
        // left: 16,
        right: 16,
        bottom: 64,
        zIndex: 11,
        height: 46,
        width: 46,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1c494f",
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },

    lowerContent: {
        backgroundColor: "#161718", // A mesma cor que o gradiente termina
        paddingHorizontal: 20,
        paddingTop: 24,
        minHeight: 1000,
    },
    sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    score: { color: "#fff", fontSize: 36, fontWeight: "900", marginTop: 8 },
    date: { color: "#777", fontSize: 14, marginTop: 4 },
    fakeReviewCard: {
        height: 80,
        backgroundColor: "#1e1e1e",
        borderRadius: 8,
        marginTop: 12,
    },
    moreData: {
        marginTop: 24,
        padding: 16,
        backgroundColor: "#1e1e1e",
    },
    extraInfo: {
        color: "#777",
        fontSize: 14,
    },
    blob: {
        position: "absolute",
        borderRadius: 999,
        opacity: 0.6,
    },
});
