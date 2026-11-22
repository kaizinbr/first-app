import ShareBtn from "@/components/core/share-btn";
import { SettingsIcon } from "@solar-icons/react-native/linear/settings";
import { AltArrowLeftIcon } from "@solar-icons/react-native/linear/alt-arrow-left";
import { darkenColor } from "@/lib/util/workWithColors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Alert, Pressable, Share, StyleSheet, View } from "react-native";
import { useHeaderMeasurements } from "react-native-collapsible-tab-view";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { selectAlbumColor } from "@/lib/util/selectRightColor";
import TextDefault from "@/components/core/text-core";

export default function FixedTopBar({
    title,
    height,
    palette,
    itsUser = false,
    username,
}: {
    title: string;
    height: number;
    palette: any;
    itsUser?: boolean;
    username: string;
}) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const mainColor = selectAlbumColor(palette).hex;

    // Puxa a medida de rolagem de forma segura
    const measurements = useHeaderMeasurements();

    const HEADER_MAX_HEIGHT = 400; // Tamanho total da área do gradiente
    const HEADER_MIN_HEIGHT = insets.top + 50; // Tamanho da barrinha que vai ficar fixa
    const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

    // Animações rodando na UI Thread (zero travamentos)
    const animatedStyle = useAnimatedStyle(() => {
        // Fallback para 0 caso o valor seja undefined no primeiro frame
        const scrollValue = measurements.top?.value ?? 0;

        // Conforme a header sobe (fica negativo), nós empurramos a barra pra baixo (positivo)
        const translateY = Math.abs(scrollValue);
        const opacity = interpolate(
            translateY,
            [100, 150],
            [0, 1],
            Extrapolation.CLAMP,
        );

        return {
            transform: [{ translateY }],
            opacity, // Barra ficando opaca conforme sobe
        };
    });

    const titleStyle = useAnimatedStyle(() => {
        const scrollValue = measurements.top?.value ?? 0;
        const translateY = Math.abs(scrollValue);
        const opacity = interpolate(
            translateY,
            [120, 160],
            [0, 1],
            Extrapolation.CLAMP,
        );

        return { opacity };
    });

    //     const topBarStyle = useAnimatedStyle(() => {
    //     const opacity = interpolate(
    //         scrollY.value,
    //         [SCROLL_DISTANCE - 40, SCROLL_DISTANCE],
    //         [0, 1],
    //         Extrapolation.CLAMP,
    //     );
    //     const transform = [
    //         {
    //             translateY: interpolate(
    //                 scrollY.value,
    //                 [SCROLL_DISTANCE - 40, SCROLL_DISTANCE],
    //                 [-32, 0],
    //                 Extrapolation.CLAMP,
    //             ),
    //         },
    //     ];
    //     return { opacity, transform };
    // });

    const onShare = async () => {
        console.log("Shared successfully");
        try {
            const result = await Share.share({
                message: "https://whistle.kaizin.work/",
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    return (
        <>
            <Animated.View
                style={[
                    styles.fixedBar,
                    { height: height, paddingTop: insets.top },
                    animatedStyle,
                ]}
                pointerEvents="box-none"
            >
                <LinearGradient
                    colors={["#161718", "transparent"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[StyleSheet.absoluteFill, { zIndex: 0 }]}
                />
                <Pressable
                    style={[
                        styles.backButton,
                        {
                            top: insets.top + 4,
                            backgroundColor: darkenColor(mainColor, 0.3),
                        },
                    ]}
                    onPress={() => router.back()}
                >
                    <AltArrowLeftIcon
                        style={{ left: -2 }}
                        size={24}
                        strokeWidth={3}
                        color="#eee"
                    />
                </Pressable>

                <Animated.View
                    style={[
                        styles.title,
                        // titleStyle,
                        { backgroundColor: darkenColor(mainColor, 0.3) },
                    ]}
                >
                    <TextDefault style={styles.titleText}>
                        {title.length > 32
                            ? title.substring(0, 32) + "..."
                            : title}
                    </TextDefault>
                </Animated.View>

                {itsUser ? (
                    <>
                        <View
                            style={[
                                styles.fixedBtn,
                                {
                            top: insets.top + 4,
                                    backgroundColor: darkenColor(
                                        mainColor,
                                        0.3,
                                    ),
                                },
                            ]}
                        >
                            <ShareBtn
                                type="profile"
                                url={`https://whistle.kaizin.work/${username}`}
                            />
                        </View>
                        <View
                            style={[
                                styles.fixedBtn,
                                {
                                    right: 16,
                            top: insets.top + 4,
                                    backgroundColor: darkenColor(
                                        mainColor,
                                        0.3,
                                    ),
                                },
                            ]}
                        >
                            <Pressable
                                style={[styles.confBtn]}
                                onPress={() => router.push("/settings/menu")}
                            >
                                <SettingsIcon size={24} color="#eee" />
                            </Pressable>
                        </View>
                    </>
                ) : (
                    <View
                        style={[
                            styles.fixedBtn,
                            {
                                right: 16,
                            top: insets.top + 4,
                                backgroundColor: darkenColor(mainColor, 0.3),
                            },
                        ]}
                    >
                        <ShareBtn
                            type="profile"
                            url={`https://whistle.kaizin.work/${username}`}
                        />
                    </View>
                )}
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    fixedBar: {
        position: "absolute", // Fica flutuando acima da ProfileHeader
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        zIndex: 999,
    },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
        backgroundColor: "rgba(22,23,24,0.7)",
        alignItems: "center",
        borderRadius: 999,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    confBtn: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: "#eee",
        fontWeight: "bold",
        fontFamily: "Walsheim",
        borderRadius: 9999,
        height: 40,
        maxWidth: "70%",
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(22,23,24,0.7)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 11,
    },
    titleText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "semibold",
    },
    fixedTopBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        // backgroundColor: "#1c494f", // Cor final da barrinha
        zIndex: 10,
        alignItems: "center",
        justifyContent: "center",
        // borderBottomWidth: 1,
        // borderBottomColor: "rgba(255,255,255,0.05)",
    },
    fixedTitleContainer: {
        borderRadius: 9999,
        height: 40,
        maxWidth: "70%",
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(22,23,24,0.7)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    fixedTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "semibold",
    },
    fixedBtn: {
        flexDirection: "row",
        gap: 8,
        height: 40,
        width: 40,
        position: "absolute",
        right: 64,
        zIndex: 11,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 999,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: "rgba(22,23,24,0.7)",
    },
});
