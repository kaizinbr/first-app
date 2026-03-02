import { LinearGradient } from "expo-linear-gradient";
import { ColorValue, Image, Text, TouchableOpacity, View } from "react-native";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { getColors } from "react-native-image-colors";

import { Palette } from "@/lib/types";

interface GradientCardProps {
    image: string;
    value: string;
    subtitle?: number;
    onPress?: () => void;
}

export function AlbumCard({
    image,
    value,
    subtitle,
    onPress,
}: GradientCardProps) {
    const Wrapper = onPress ? TouchableOpacity : View;

    const [colors, setColors] = useState<Palette | any>(null);

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
            {colors && (<LinearGradient
                colors={[colors.darkVibrant != "#000000" ? colors.darkVibrant : colors.muted, "#282b30"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#333",
                    flexDirection: "row",
                    overflow: "hidden",
                }}
            >
                <Image
                    source={{ uri: image }}
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius: 8,
                        objectFit: "cover",
                    }}
                />

                <View style={{ marginLeft: 12, flexShrink: 1 }}>
                    <Text
                        style={{
                            color: "#eee",
                            fontSize: 22,
                            fontWeight: "900",
                        }}
                    >
                        {value}
                    </Text>

                    {subtitle && (
                        <Text
                            style={{
                                marginTop: 4,
                                color: "#d1d5db",
                                fontSize: 12,
                            }}
                        >
                            {subtitle} músicas avaliadas
                        </Text>
                    )}
                </View>
            </LinearGradient>)
            }
        </Wrapper>
    );
}
