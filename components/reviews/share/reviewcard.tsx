import TextDefault from "@/components/core/text-core";
import { Album, Review } from "@/lib/types";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View } from "react-native";
import { Stars } from "@solar-icons/react-native/Bold";

type ReviewCardProps = {
    reviewData: Review;
    albumData: Album;
    colorOne: string;
    colorTwo: string;
    width: number;
    extraType?: "comment" | "favorite" | null;
    extraData?: string | null;
};

export default function ReviewCard({
    reviewData,
    albumData,
    colorOne,
    colorTwo,
    width,
    extraType = null,
    extraData,
}: ReviewCardProps) {
    const height = (width * 16) / 9;
    const s = (n: number) => (n / 312) * width;

    return (
        <View style={{ width, height, backgroundColor: "#000" }}>
            <LinearGradient
                colors={[colorOne, "#000"]}
                style={[StyleSheet.absoluteFill, { opacity: 0.9 }]}
            />

            <View
                style={{
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: s(32),
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
                        source={{ uri: reviewData.Profile.avatar_url }}
                        style={{
                            width: s(28),
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
                            width: "60%",
                            aspectRatio: 1,
                            marginTop: s(16),
                            borderRadius: s(8),
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

                {/* --- OPÇÃO SELECIONADA --- */}
                {extraType === "comment" && extraData && (
                    <View
                        style={[
                            {
                                marginTop: s(16),
                                flexDirection: "row",
                                alignItems: "center",
                                gap: s(8),
                                backgroundColor: "#161718",
                                padding: s(12),
                                borderRadius: s(8),
                            },
                        ]}
                    >
                        <TextDefault
                            style={{
                                color: "#eee",
                                fontSize: s(10),
                                fontWeight: "400",
                                fontFamily: "Walsheim",
                            }}
                            numberOfLines={3}
                        >
                            {extraData}
                        </TextDefault>
                    </View>
                )}

                {extraType === "favorite" && extraData && (
                    <View
                        style={[
                            {
                                marginTop: s(16),
                                flexDirection: "row",
                                alignItems: "center",
                                gap: s(8),
                                backgroundColor: "#161718",
                                padding: s(12),
                                borderRadius: s(8),
                            },
                        ]}
                    >
                        <Stars size={s(24)} color="#8065ef" />
                        <View>
                            <TextDefault
                                style={{
                                    color: "#989898",
                                    fontSize: s(10),
                                    fontWeight: "400",
                                    fontFamily: "Walsheim",
                                }}
                                numberOfLines={1}
                            >
                                Música favorita
                            </TextDefault>
                            <TextDefault
                                style={{
                                    color: "#eee",
                                    fontSize: s(10),
                                    fontWeight: "400",
                                    fontFamily: "Walsheim",
                                }}
                                numberOfLines={1}
                            >
                                {extraData}
                            </TextDefault>
                        </View>
                    </View>
                )}

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
    section: {
        backgroundColor: "#161718",
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
});
