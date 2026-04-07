import React from "react";
import {
    ImageSourcePropType,
    type ImageStyle,
    type StyleProp,
    StyleSheet,
    Text,
    View,
    type ViewProps,
    Pressable,
} from "react-native";
import type { AnimatedProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";

import { useState, useEffect } from "react";
import { Image } from "expo-image";
import { getBannerColor } from "@/lib/util/workWithColors";
import { getColors } from "react-native-image-colors";
import { Palette } from "@/lib/types";
import { LinearGradient } from "expo-linear-gradient";

interface Props extends AnimatedProps<ViewProps> {
    item: any; // O objeto do álbum que acabamos de passar
    style?: StyleProp<ImageStyle>;
    index?: number;
    rounded?: boolean;
    source?: ImageSourcePropType;
    colorFill?: boolean;
}

export const SlideItem: React.FC<Props> = (props) => {
    const {
        item,
        style,
        index = 0,
        rounded = false,
        testID,
        colorFill = false,
        ...animatedViewProps
    } = props;

    const [palette, setPalette] = useState<Palette | any>(null);

    const router = useRouter();
    // console.log(item);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const result = await getColors(item.src, {
                    fallback: "#000",
                    cache: true,
                    key: item.src,
                });
                setPalette(result);
            } catch (error) {
                console.error("Error fetching colors:", error);
            }
        };
        fetchColors();
    }, []);

    return (
        <>
            {palette && colorFill && (
                <Animated.View
                    testID={testID}
                    style={{
                        flex: 1,
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        backgroundColor: getBannerColor(palette),
                        borderRadius: 24,
                        overflow: "hidden",
                    }}
                    {...animatedViewProps}
                >
                    <Pressable
                        style={{
                            flex: 1,
                            width: "100%",
                            height: "100%",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            borderRadius: 24,
                            overflow: "hidden",
                        }}
                        onPress={() => router.push(`/album/${item.album_id}`)}
                    >
                        <View
                            style={[
                                styles.back,
                                {
                                    backgroundColor: getBannerColor(palette),
                                },
                            ]}
                        ></View>
                        <LinearGradient
                            colors={[
                                getBannerColor(palette),
                                "transparent",
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.gradient]}
                        />
                        {/* <View
                            style={[
                                styles.gradient,
                                {
                                    backgroundColor: "red",
                                },
                            ]}
                        ></View> */}
                        <Image
                            source={{ uri: item.src }}
                            style={styles.img}
                            contentFit="contain"
                        />
                        <View style={styles.overlay}>
                            <View style={styles.overlayTextContainer}>
                                {/* Exibimos os dados dinâmicos do álbum */}
                                <Text style={styles.titleText}>
                                    {item.title}
                                </Text>
                                <Text style={styles.artistText}>
                                    {item.artist}
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                </Animated.View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    back: {
        // width: "60%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",

        zIndex: 10,
    },
    gradient: {
        // width: "20%",
        height: "100%",
        aspectRatio: 1.01/1,
        // alignItems: "center",
        // justifyContent: "center",
        // marginRight: 224,
        zIndex: 10,
        position: "absolute",
        right: 0,
    },
    img: {
        // width: "100%",
        height: "100%",
        aspectRatio: 1,
        position: "absolute",
        right: 0,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "flex-end", // Joga o texto para a parte de baixo do banner
        padding: 20,
    },
    titleText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        shadowColor: "rgba(0, 0, 0, 0.8)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
    },
    artistText: {
        color: "#eeeeee",
        fontSize: 16,
        marginTop: 4,
        shadowColor: "rgba(0, 0, 0, 0.8)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
    },
    overlayTextContainer: {
        // backgroundColor: "rgba(0, 0, 0, 0.4)", // Um fundo leve para leitura
        paddingVertical: 16,
        borderRadius: 10,
        width: "50%",
        zIndex: 20,
    },
    colorFill: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
