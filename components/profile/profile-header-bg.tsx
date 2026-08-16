import TextDefault from "@/components/core/text-core";
import api, { apiAuth, apiAuthPost } from "@/lib/api";
import { Palette, UserProfile } from "@/lib/types";
import { selectBackgroundColor } from "@/lib/util/selectRightColor";
import { getPalette } from "expo-color-thief-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getColors } from "react-native-image-colors";

import chroma from "chroma-js";
import type { ColorThiefColorData } from "expo-color-thief-native";

import PlayingOnLastFM from "@/components/profile/last-fm-card";
import { VerifiedCheck } from "@/lib/solar-icons/Bold";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ProfileHeaderBG({ avatar_url }: { avatar_url: string  }) {
    const router = useRouter();
    const [colors, setColors] = useState<Palette | any>({
        dominant: "#8065ef",
        vibrant: "#8065ef",
        darkVibrant: "#8065ef",
        muted: "#8065ef",
    });
    const [pureColors, setPureColors] = useState<Palette | any>(null);
    const [colorsA, setColorsA] = useState<ColorThiefColorData[] | any>([
        {
            b: 40,
            contrast: {
                black: 1.2356125186127032,
                foreground: "#ffffff",
                white: 16.995619325367446,
            },
            g: 23,
            hex: "#261728",
            hsl: {
                h: 292.9411764705883,
                l: 0.12352941176470589,
                s: 0.2698412698412698,
            },
            isDark: true,
            isLight: false,
            oklch: {
                c: 0.03857433556681822,
                h: 322.58298061878503,
                l: 0.2320606739879971,
            },
            population: 4629,
            proportion: 0.514962732228279,
            r: 38,
            textColor: "#ffffff",
        },
    ]);
    const [mainColor, setMainColor] = useState("#161718");

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const result = await getColors(avatar_url, {
                    fallback: "#000",
                    cache: true,
                    key: avatar_url,
                    quality: "low",
                });
                setPureColors(result);

                const fetchedColors = await getPalette(avatar_url, {
                    colorCount: 6,
                    quality: 10,
                });
                // console.log("Colors fetched successfully:", fetchedColors);
                setColorsA(fetchedColors);
                setMainColor(selectBackgroundColor(fetchedColors).background);
            } catch (error) {
                console.error("Error fetching colors:", error);
            }
        };
        fetchColors();
    }, [avatar_url]);

    return (
        <>
            <LinearGradient
                colors={[mainColor, "#161718"]}
                style={[StyleSheet.absoluteFill, { height: 180 }]}
            />

            {/* blob principal - vem da cor dominante do álbum */}
            <View
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: "center",
                }}
            >
                {/* principal do fundo */}
                <View
                    style={[
                        styles.blob,
                        {
                            backgroundColor: mainColor,
                            width: 624,
                            height: 486,
                            top: -264,
                            borderRadius: 9999,
                            filter: [{ blur: 78 }],
                            opacity: 0.6,
                            // zIndex: -5,
                        },
                    ]}
                />
                {mainColor && (
                    <>
                        {/* pequeno, lado esquerdo */}
                        {/* <View
                            style={[
                                styles.blob,
                                {
                                    position: "absolute",
                                    backgroundColor: chroma(mainColor)
                                        .brighten()
                                        .saturate(.5)
                                        .hex(),
                                    width: "25%",
                                    aspectRatio: 1,
                                    top: 144,
                                    left: "10%",
                                    filter: [{ blur: 70 }],
                                    opacity: 0.6,
                                    zIndex: 0,
                                },
                            ]}
                        /> */}

                        {/* Pequeno, lado direito */}
                        {/* <View
                            style={[
                                styles.blob,
                                {
                                    position: "absolute",
                                    backgroundColor: chroma(mainColor)
                                        .brighten()
                                        .saturate(.5)
                                        .hex(),
                                    width: "25%",
                                    aspectRatio: 1,
                                    top: 144,
                                    right: "10%",
                                    filter: [{ blur: 70 }],
                                    opacity: 0.6,
                                    zIndex: 0,
                                },
                            ]}
                        /> */}

                        {/* maior, lado direito */}
                        <View
                            style={[
                                styles.blob,
                                {
                                    position: "absolute",
                                    backgroundColor: chroma(mainColor)
                                        .saturate(1)
                                        .hex(),
                                    width: 66,
                                    height: 168,
                                    top: 144,
                                    right: "22%",
                                    filter: [{ blur: 56 }],
                                    opacity: 0.6,
                                    zIndex: 0,
                                    transform: [{ rotate: "40deg" }],
                                },
                            ]}
                        />

                        {/* maior, lado esquerdo */}
                        <View
                            style={[
                                styles.blob,
                                {
                                    position: "absolute",
                                    backgroundColor: chroma(mainColor)
                                        .saturate(1)
                                        .hex(),
                                    width: 66,
                                    height: 168,
                                    top: 144,
                                    left: "22%",
                                    filter: [{ blur: 56 }],
                                    opacity: 0.6,
                                    zIndex: 0,
                                    transform: [{ rotate: "-40deg" }],
                                },
                            ]}
                        />

                        {/* centro */}
                        <View
                            style={[
                                styles.blob,
                                {
                                    position: "absolute",
                                    backgroundColor: chroma(mainColor)
                                        .brighten(0.5)
                                        .saturate(1)
                                        .hex(),
                                    width: 144,
                                    aspectRatio: 1,
                                    top: 186,
                                    left: "50%",
                                    marginLeft: -72,
                                    filter: [{ blur: 44 }],
                                    opacity: 0.7,
                                    zIndex: 0,
                                },
                            ]}
                        />
                    </>
                )}
            </View>

            {/* vinheta no topo pra escurecer onde fica o header */}
            <LinearGradient
                colors={["rgba(0,0,0,0.6)", "transparent"]}
                style={[StyleSheet.absoluteFill, { height: 180 }]}
            />

            {/* <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        flexWrap: "wrap",
                    }}
                >
                    {colorsA?.map((color: any, index: number) => (
                        <View
                            key={index}
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 48 * 0.306,
                                backgroundColor: color.hex,
                            }}
                        >
                            <TextDefault
                                style={{
                                    color: color.textColor,
                                    fontSize: 24,
                                    textAlign: "center",
                                }}
                            >
                                {color.proportion.toFixed(2) * 100}%
                            </TextDefault>
                        </View>
                    ))}
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        flexWrap: "wrap",
                    }}
                >
                    <View
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 48 * 0.306,
                            backgroundColor:
                                mainColor,
                        }}
                    ></View>
                </View> */}
        </>
    );
}

const styles = StyleSheet.create({
    scene: {
        overflow: "hidden",
        position: "relative",
    },
    header: {
        padding: 16,
        paddingTop: 112,
        paddingBottom: 32,
        width: "100%",
        alignItems: "center",
    },
    gradientContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0, // Fica atrás do ScrollView
    },
    blob: {
        // position: "absolute",
        borderRadius: 9999,
    },
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexDirection: "column",
        marginBottom: 28,
    },
    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 14,
    },
    name: {
        fontWeight: "bold",
        color: "#eee",
        fontSize: 18,
        alignItems: "center",
        flexDirection: "row",
        gap: 4,
    },
    username: {
        color: "#b9b9b9",
        fontSize: 14,
        marginTop: 4,
    },
    pronouns: {
        color: "#929292",
        fontSize: 12,
        marginTop: 4,
        position: "absolute",
        bottom: -20,
        zIndex: 10,
        backgroundColor: "#8065ef",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    pronounstext: {
        color: "#eee",
        fontSize: 12,
        fontWeight: "bold",
    },
    avatar: {
        backgroundColor: "#bbb",
    },
    followBtn: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: "#8065ef",
    },

    lastWrapper: {
        marginTop: 12,
        backgroundColor: "rgba(128, 101, 239, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    lastUsername: {
        color: "#eee",
        fontSize: 12,
    },
});
