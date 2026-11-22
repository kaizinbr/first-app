import { ActivityIndicator, View } from "react-native";
import TextDefault from "@/components/core/text-core";
import type { LastfmGenre } from "@/lib/lastfm-types";

/** Top de gêneros: cada faixa enche conforme o peso, com os artistas que mais puxaram o gênero. */
export default function GenreList({
    genres,
    isLoading,
    isError,
    isPlaceholderData,
}: {
    genres: LastfmGenre[] | undefined;
    isLoading: boolean;
    isError: boolean;
    isPlaceholderData: boolean;
}) {
    const top = genres?.[0]?.weight || 1;

    return (
        <View
            style={{
                backgroundColor: "#212223",
                padding: 16,
                borderRadius: 18,
                gap: 12,
            }}
        >
            <TextDefault
                style={{ color: "#989898", fontSize: 14, fontWeight: "bold" }}
            >
                Gêneros
            </TextDefault>

            {isLoading ? (
                <View style={{ alignItems: "center", gap: 8 }}>
                    <ActivityIndicator color="#8065ef" />
                    <TextDefault style={{ color: "#989898", fontSize: 12 }}>
                        Calculando gêneros...
                    </TextDefault>
                </View>
            ) : !genres ? (
                <TextDefault style={{ color: "#989898", fontSize: 14 }}>
                    {isError ? "Não foi possível carregar." : ""}
                </TextDefault>
            ) : genres.length === 0 ? (
                <TextDefault style={{ color: "#989898", fontSize: 14 }}>
                    Nenhum gênero encontrado neste período.
                </TextDefault>
            ) : (
                <View style={{ gap: 10, opacity: isPlaceholderData ? 0.5 : 1 }}>
                    {genres.map((genre) => (
                        <View
                            key={genre.name}
                            style={{
                                borderRadius: 12,
                                backgroundColor: "#2a2b2c",
                                overflow: "hidden",
                            }}
                        >
                            <View
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    width: `${Math.max(8, Math.round((genre.weight / top) * 100))}%`,
                                    backgroundColor: "#8065ef55",
                                }}
                            />
                            <View style={{ padding: 12, gap: 2 }}>
                                <TextDefault
                                    style={{
                                        color: "#eee",
                                        fontSize: 14,
                                        fontWeight: "700",
                                    }}
                                >
                                    {genre.name}
                                </TextDefault>
                                <TextDefault
                                    numberOfLines={1}
                                    style={{ color: "#989898", fontSize: 12 }}
                                >
                                    {genre.artists.join(", ")}
                                </TextDefault>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}
