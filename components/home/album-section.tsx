import { LinearGradient } from "expo-linear-gradient";
import { ColorValue, Image, Text, TouchableOpacity, View } from "react-native";
import api from "@/lib/api";
import { useState, useEffect } from "react";

interface GradientCardProps {
    image: string;
    value: string;
    subtitle?: string;
    onPress?: () => void;
}

export function AlbumCard({
    image,
    value,
    subtitle,
    onPress,
}: GradientCardProps) {
    const Wrapper = onPress ? TouchableOpacity : View;

    const [colors, setColors] = useState<{"DarkMuted": string, "DarkVibrant": string, "Muted": string, "Vibrant": string    } | any>(null);


    useEffect(() => {
        const url = image;

        api.post("/colors", { imageUrl: url })
            .then((response) => {
                setColors(response.data);
                // console.log("Cores extraídas:", response.data);
            })
            .catch((error) => {
                console.error("Erro ao extrair cores:", error);
            });
    }, []);

    return (
        <Wrapper style={{ marginTop: 12 }} activeOpacity={0.8}>
            <LinearGradient
                colors={[colors?.Vibrant || "#282b30", "#282b30"]}
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
            </LinearGradient>
        </Wrapper>
    );
}
