import TextDefault from "@/components/core/text-core";
import { Album, Palette, Review } from "@/lib/types";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View } from "react-native";
import {
    lightenColor,
    darkenColor,
    getBannerColors,
    saturateColor
} from "@/lib/util/workWithColors";

type ReviewCardProps = {
    reviewData: Review;
    albumData: Album;
    colorOne: string;
    colorTwo: string;
    /** Card width in pixels — height is always 16/9 of this (portrait 9:16) */
    width: number;
};

/**
 * Pure presentational card — no refs, no capture logic.
 * Used both in the on-screen preview and in the offscreen high-res layer.
 */
export default function ReviewCard({
    reviewData,
    albumData,
    colorOne,
    colorTwo,
    width,
}: ReviewCardProps) {
    const height = (width * 16) / 9;

    // Scale all sizes relative to the card width so the card looks
    // identical whether rendered at 270 px (preview) or 1080 px (capture).
    const s = (n: number) => (n / 270) * width;

    return (
        <View style={{ width, height, backgroundColor: "#000" }}>
            {/* Gradients — rendered behind everything else via zIndex */}
            <LinearGradient
                colors={[colorOne, "#000"]}
                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                style={[StyleSheet.absoluteFill, { opacity: 0.4 }]}
            />
            <LinearGradient
                colors={[saturateColor(colorOne, 1), "#000"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[StyleSheet.absoluteFill, { opacity: 0.4 }]}
            />
            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.5)"]}
                start={{ x: 0.5, y: 0.2 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Content */}
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: s(24),
                }}
            >
                {/* Avatar + Album art */}
                <View
                    style={{
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                    }}
                >
                    <Image
                        source={{ uri: reviewData.Profile.avatar_url }}
                        style={{
                            width: s(32),
                            aspectRatio: 1,
                            borderRadius: s(18 * 0.36),
                            position: "absolute",
                            top: -s(2),
                            zIndex: 2,
                            shadowColor: "rgba(0,0,0,0.5)",
                            shadowOffset: { width: 0, height: s(4) },
                            shadowRadius: s(8),
                            shadowOpacity: 0.5,
                        }}
                        resizeMode="cover"
                    />
                    <Image
                        source={{ uri: albumData.images[0].url }}
                        style={{
                            width: "55%",
                            aspectRatio: 1,
                            marginTop: s(16),
                            borderRadius: s(6),
                            shadowColor: "rgba(0,0,0,0.5)",
                            shadowOffset: { width: 0, height: s(4) },
                            shadowRadius: s(8),
                            shadowOpacity: 0.5,
                        }}
                        resizeMode="cover"
                    />
                </View>

                {/* Score */}
                <TextDefault
                    style={{
                        color: "#eee",
                        fontSize: s(22),
                        fontWeight: "800",
                        marginTop: s(12),
                        fontFamily: "Walsheim",
                    }}
                >
                    {Number(reviewData.total).toFixed(1)}/100
                </TextDefault>

                {/* "X avaliou" */}
                <TextDefault
                    style={{
                        color: "#eee",
                        fontSize: s(12),
                        fontWeight: "400",
                        marginTop: s(12),
                        fontFamily: "Walsheim",
                    }}
                >
                    {reviewData.Profile.name} avaliou
                </TextDefault>

                {/* Album name */}
                <TextDefault
                    style={{
                        color: "#eee",
                        fontSize: s(12),
                        fontWeight: "700",
                        marginTop: s(6),
                        fontFamily: "Walsheim",
                        textAlign: "center",
                    }}
                    numberOfLines={2}
                >
                    {albumData.name}
                </TextDefault>

                {/* Artist */}
                <TextDefault
                    style={{
                        color: "#989898",
                        fontSize: s(12),
                        fontWeight: "400",
                        marginTop: s(4),
                        fontFamily: "Walsheim",
                    }}
                    numberOfLines={2}
                >
                    {albumData.artists[0].name}
                </TextDefault>

                {/* Footer */}
                <TextDefault
                    style={{
                        color: "#989898",
                        fontSize: s(10),
                        fontWeight: "400",
                        marginTop: s(24),
                        fontFamily: "Walsheim",
                    }}
                >
                    Veja mais em whistle.kaizin.work
                </TextDefault>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    blob: {
        position: "absolute",
        borderRadius: 999,
        opacity: 0.6,
    },
});
