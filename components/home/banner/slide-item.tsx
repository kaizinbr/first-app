import React from "react";
import {
    ImageSourcePropType,
    type ImageStyle,
    type StyleProp,
    StyleSheet,
    Text,
    View,
    type ViewProps,
} from "react-native";
import type { AnimatedProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";

import { useState, useEffect } from "react";
import { Image } from "expo-image";
import { selectRightColor } from "@/lib/util/selectRightColor";
import { getColors } from "react-native-image-colors";
import { Palette } from "@/lib/types";

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
        <Animated.View
            testID={testID}
            style={{ flex: 1 }}
            {...animatedViewProps}
        >
            {/* Usamos a cor que veio de dentro do item.color, se colorFill for true */}
            {palette && (
                <View
                    style={[
                        styles.colorFill,
                        rounded && { borderRadius: 15 },
                        { backgroundColor: selectRightColor(palette) || "gray" },
                    ]}
                />
            )}

            <View style={styles.overlay}>
                <View style={styles.overlayTextContainer}>
                    {/* Exibimos os dados dinâmicos do álbum */}
                    <Text style={styles.titleText}>{item.title}</Text>
                    <Text style={styles.artistText}>{item.artist}</Text>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
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
    },
    artistText: {
        color: "#eeeeee",
        fontSize: 16,
        marginTop: 4,
    },
    overlayTextContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.4)", // Um fundo leve para leitura
        padding: 16,
        borderRadius: 10,
        width: "100%",
    },
    colorFill: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
