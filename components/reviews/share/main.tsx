import TextDefault from "@/components/core/text-core";
import { Album, Palette, Review } from "@/lib/types";
import { AltArrowLeft } from "@solar-icons/react-native/Linear";
import {
    GalleryDownload,
    SquareShareLine,
} from "@solar-icons/react-native/Outline";
import { LinearGradient } from "expo-linear-gradient";
import { Asset, requestPermissionsAsync } from "expo-media-library";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot, { captureRef } from "react-native-view-shot";

const COLOR_OPTIONS = [
    { key: "dominant", label: "Dominant" },
    { key: "vibrant", label: "Vibrant" },
    { key: "darkVibrant", label: "Dark Vibrant" },
    { key: "lightVibrant", label: "Light Vibrant" },
    { key: "muted", label: "Muted" },
    { key: "darkMuted", label: "Dark Muted" },
    { key: "lightMuted", label: "Light Muted" },
    { key: "black", label: "Black" },
    { key: "white", label: "White" },
] as const;

type ColorOptionKey = (typeof COLOR_OPTIONS)[number]["key"];

export default function ShareReview({
    reviewData,
    albumData,
    colors,
}: {
    reviewData: Review;
    albumData: Album;
    colors: Palette;
}) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const scrollY = useSharedValue(0);

    const [colorOne, setColorOne] = useState(colors.dominant);
    const [colorTwo, setColorTwo] = useState(colors.vibrant);

    const [isLoading, setIsLoading] = useState(false);

    const [asset, setAsset] = useState<Asset | null>(null);

    const getColorValue = (key: ColorOptionKey) => {
        switch (key) {
            case "dominant":
                return colors.dominant;
            case "vibrant":
                return colors.vibrant;
            case "darkVibrant":
                return colors.darkVibrant;
            case "lightVibrant":
                return colors.lightVibrant;
            case "muted":
                return colors.muted;
            case "darkMuted":
                return colors.darkMuted;
            case "lightMuted":
                return colors.lightMuted;
            case "black":
                return "#000";
            case "white":
                return "#fff";
        }
    };

    const cardRef = useRef(null);
    const captureCard = async (): Promise<string> => {
        return await captureRef(cardRef, {
            format: "png",
            quality: 1,
            width: 1080,
            height: 1920,
            result: "tmpfile",
        });
    };

    // Abre o share sheet nativo — funciona pra Instagram, WhatsApp, etc.
    const handleShare = async () => {
        setIsLoading(true);
        try {
            const uri = await captureCard();
            await Sharing.shareAsync(uri, {
                mimeType: "image/png",
                dialogTitle: "Compartilhar review",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Salva na galeria (caso queira dar essa opção separada)
    const handleSaveToGallery = async () => {
        setIsLoading(true);
        try {
            const { status } = await requestPermissionsAsync();
            console.log("Permission status:", status);
            if (status !== "granted") return;

            const uri = await captureCard();
            const savedAsset = await Asset.create(uri);
            setAsset(savedAsset);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Animated.View
                style={[
                    styles.statusBarBg,
                    {
                        height: insets.top + 24,
                    },
                ]}
                pointerEvents="none"
            >
                <LinearGradient
                    colors={["#161718", "transparent"]}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
            <Pressable
                onPress={() => router.back()}
                style={[styles.backButton, { top: insets.top + 4 }]}
            >
                <AltArrowLeft size={32} color="#eee" />
            </Pressable>
            <ScrollView
                style={[styles.container]}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        flex: 1,
                        width: "100%",
                        marginTop: 44,
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: 16,
                        marginBottom: 100,
                        paddingHorizontal: 16,
                    }}
                >
                    <View
                        style={{
                            aspectRatio: "9/16",
                            width: "50%",
                            backgroundColor: colorOne,
                            borderRadius: 16,
                            overflow: "hidden",
                            shadowColor: "rgba(0,0,0,0.8)",
                            shadowOffset: { width: 0, height: 4 },
                            shadowRadius: 8,
                            shadowOpacity: 0.8,
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                    >
                        <ViewShot
                            ref={cardRef}
                            options={{
                                format: "png",
                                quality: 1,
                                width: 1080 * 2,
                                height: 1920 * 2,
                            }}
                            style={{
                                aspectRatio: "9/16",
                                width: "100%",
                                backgroundColor: colorOne,
                            }}
                        >
                            <View
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    zIndex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <View
                                    style={{
                                        width: "100%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        position: "relative",
                                    }}
                                >
                                    <Image
                                        source={{
                                            uri: reviewData.Profile.avatar_url,
                                        }}
                                        style={{
                                            width: 22,
                                            aspectRatio: 1,
                                            marginTop: 16,
                                            borderRadius: 18 * 0.306,
                                            position: "absolute",
                                            top: -12,
                                            zIndex: 2,
                                            shadowColor: "rgba(0,0,0,0.5)",
                                            shadowOffset: {
                                                width: 0,
                                                height: 4,
                                            },
                                            shadowRadius: 8,
                                            shadowOpacity: 0.5,
                                        }}
                                        resizeMode="cover"
                                    />
                                    <Image
                                        source={{
                                            uri: albumData.images[0].url,
                                        }}
                                        style={{
                                            width: "55%",
                                            aspectRatio: 1,
                                            marginTop: 16,
                                            borderRadius: 6,
                                            shadowColor: "rgba(0,0,0,0.5)",
                                            shadowOffset: {
                                                width: 0,
                                                height: 4,
                                            },
                                            shadowRadius: 8,
                                            shadowOpacity: 0.5,
                                        }}
                                        resizeMode="cover"
                                    />
                                </View>
                                <TextDefault
                                    style={{
                                        color: "#eee",
                                        fontSize: 16,
                                        fontWeight: 800,
                                        marginTop: 12,
                                        fontFamily: "Walsheim",
                                    }}
                                >
                                    {Number(reviewData.total).toFixed(1)}/100
                                </TextDefault>
                                <TextDefault
                                    style={{
                                        color: "#eee",
                                        fontSize: 7,
                                        fontWeight: 400,
                                        marginTop: 12,
                                        fontFamily: "Walsheim",
                                    }}
                                >
                                    {reviewData.Profile.name} avaliou
                                </TextDefault>
                                <TextDefault
                                    style={{
                                        color: "#eee",
                                        fontSize: 8,
                                        fontWeight: 700,
                                        marginTop: 6,
                                        fontFamily: "Walsheim",
                                    }}
                                    numberOfLines={2}
                                >
                                    {albumData.name}
                                </TextDefault>
                                <TextDefault
                                    style={{
                                        color: "#989898",
                                        fontSize: 7,
                                        fontWeight: 400,
                                        marginTop: 4,
                                        fontFamily: "Walsheim",
                                    }}
                                    numberOfLines={2}
                                >
                                    {albumData.artists[0].name}
                                </TextDefault>
                                <TextDefault
                                    style={{
                                        color: "#989898",
                                        fontSize: 7,
                                        fontWeight: 400,
                                        marginTop: 24,
                                        fontFamily: "Walsheim",
                                    }}
                                >
                                    Veja mais em whistle.kaizin.work
                                </TextDefault>
                            </View>
                            <LinearGradient
                                colors={[colorOne, "#000"]} // Troque pela cor dinâmica do álbum depois
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={StyleSheet.absoluteFill}
                            />
                            <LinearGradient
                                colors={[colorTwo, "#000"]} // Troque pela cor dinâmica do álbum depois
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={[
                                    StyleSheet.absoluteFill,
                                    { opacity: 0.5 },
                                ]}
                            />
                            {/* Camada 2: Uma sombra que vem de baixo pra criar a "profundidade" do mesh */}
                            <LinearGradient
                                colors={["transparent", "rgba(0, 0, 0, 0.5)"]}
                                start={{ x: 0.5, y: 0.2 }}
                                end={{ x: 0.5, y: 1 }}
                                style={StyleSheet.absoluteFill}
                            />
                        </ViewShot>
                    </View>

                    <View style={styles.section}>
                        <TextDefault>Cor 1</TextDefault>
                        <View
                            style={{
                                marginTop: 8,
                                width: "100%",
                                flexDirection: "row",
                                justifyContent: "center",
                                gap: 12,
                                flexWrap: "wrap",
                            }}
                        >
                            {COLOR_OPTIONS.map((option) => (
                                <Pressable
                                    key={option.key}
                                    style={{
                                        backgroundColor: getColorValue(
                                            option.key,
                                        ),
                                        height: 44,
                                        width: 44,
                                        borderRadius: 8,
                                    }}
                                    onPress={() => {
                                        setColorOne(getColorValue(option.key));
                                    }}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <TextDefault>Cor 2</TextDefault>
                        <View
                            style={{
                                marginTop: 8,
                                width: "100%",
                                flexDirection: "row",
                                justifyContent: "center",
                                gap: 12,
                                flexWrap: "wrap",
                            }}
                        >
                            {COLOR_OPTIONS.map((option) => (
                                <Pressable
                                    key={option.key}
                                    style={{
                                        backgroundColor: getColorValue(
                                            option.key,
                                        ),
                                        height: 44,
                                        width: 44,
                                        borderRadius: 8,
                                    }}
                                    onPress={() => {
                                        setColorTwo(getColorValue(option.key));
                                    }}
                                />
                            ))}
                        </View>
                    </View>

                    <Pressable onPress={handleShare} style={styles.btn}>
                        <SquareShareLine size={24} color="#eee" />
                        <TextDefault
                            style={{
                                color: "#eee",
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                        >
                            Compartilhar
                        </TextDefault>
                    </Pressable>

                    <Pressable onPress={handleSaveToGallery} style={styles.btn}>
                        <GalleryDownload size={24} color="#eee" />
                        <TextDefault
                            style={{
                                color: "#eee",
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                        >
                            Salvar na Galeria
                        </TextDefault>
                    </Pressable>
                </View>

                {isLoading && (
                    <View
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                zIndex: 999,
                            },
                        ]}
                    >
                        <ActivityIndicator size="large" color="#8065ef" />
                    </View>
                )}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
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
    fixedTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        width: "65%",
        textAlign: "center",
    },
    backButton: {
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
        // backgroundColor: "rgba(255,255,255,0.05)",
    },
    optText: {
        color: "#eee",
        fontSize: 14,
        marginLeft: 12,
    },
    btn: {
        backgroundColor: "#8065ef",
        width: "100%",
        padding: 16,
        borderRadius: 12,
        color: "#eee",
        fontSize: 16,
        fontWeight: "bold",
        gap: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    section: {
        backgroundColor: "#1b1c1d",
        padding: 16,
        borderRadius: 12,
        overflow: "hidden",
    },

    statusBarBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        zIndex: 10,
    },
});
