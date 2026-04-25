import { LinearGradient } from "expo-linear-gradient";
import {
    ColorValue,
    Image,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from "react-native";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { getColors } from "react-native-image-colors";

import { Palette } from "@/lib/types";

import { selectRightColor } from "@/lib/util/selectRightColor";

interface GradientCardProps {
    image: string;
    value: string;
    subtitle?: number;
    onPress?: () => void;
    editor?: boolean;
}

export function AlbumCard({
    image,
    value,
    subtitle,
    onPress,
    editor,
}: GradientCardProps) {
    const Wrapper = onPress ? TouchableOpacity : View;

    const [colors, setColors] = useState<Palette | any>(null);

    const imgSize = editor ? 80 : 120;

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const result = await getColors(image, {
                    fallback: "#000",
                    cache: true,
                    key: image,
                });
                setColors(result);
                // console.log("Colors fetched for album image:", result);
            } catch (error) {
                console.error("Error fetching colors:", error);
            }
        };
        fetchColors();
        // setColors(colors);
    }, []);

    return (
        <Wrapper style={{ marginTop: 12 }} activeOpacity={0.8}>
            {colors ? (
                <LinearGradient
                    colors={[selectRightColor(colors), "#282b30"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{
                        padding: 12,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: "#333",
                        flexDirection: "row",
                        overflow: "hidden",
                    }}
                >
                    <Image
                        source={{ uri: image }}
                        style={{
                            width: imgSize,
                            height: imgSize,
                            borderRadius: 8,
                            objectFit: "cover",
                        }}
                    />

                    <View style={{ marginLeft: 12, flexShrink: 1 }}>
                        {editor && (
                            <Text
                                style={{
                                    color: "#e9eaeb",
                                    fontSize: 12,
                                    marginBottom: 4,
                                }}
                            >
                                Avaliação
                            </Text>
                        )}
                        <Text
                            style={{
                                color: "#eee",
                                fontSize: 22,
                                fontWeight: 700,
                                fontFamily: "Walsheim",
                            }}
                        >
                            {value}
                        </Text>
                        {/* {subtitle && (
                            <Text
                                style={{
                                    marginTop: 4,
                                    color: "#d1d5db",
                                    fontSize: 12,
                                }}
                            >
                                {subtitle} músicas avaliadas
                            </Text>
                        )} */}
                    </View>
                </LinearGradient>
            ): ( <View style={styles.albumSection} /> )}
            
        </Wrapper>
    );
}

const styles = StyleSheet.create({
    albumSection: {
        flex: 1,
        height: 144,
        width: "100%",
        marginTop: 12,
        borderRadius: 14,
        backgroundColor: "#282828",
    },
});
