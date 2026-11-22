import { ActivityIndicator, Pressable, View } from "react-native";
import * as Linking from "expo-linking";
import TextDefault from "@/components/core/text-core";
import CoverThumb from "@/components/profile/lastfm/cover-thumb";
import type { LastfmTopResponse, LastfmTopType } from "@/lib/lastfm-types";

/** Lista numerada de um top (artistas, álbuns ou músicas). Cada item abre a página dele no Last.fm. */
export default function TopList({
    title,
    type,
    data,
    isLoading,
    isError,
    isPlaceholderData,
}: {
    title: string;
    type: LastfmTopType;
    data: LastfmTopResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    isPlaceholderData: boolean;
}) {
    const top = data?.items[0]?.playcount || 1;

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
                {title}
            </TextDefault>

            {isLoading ? (
                <ActivityIndicator color="#8065ef" />
            ) : !data ? (
                <TextDefault style={{ color: "#989898", fontSize: 14 }}>
                    {isError ? "Não foi possível carregar." : ""}
                </TextDefault>
            ) : data.items.length === 0 ? (
                <TextDefault style={{ color: "#989898", fontSize: 14 }}>
                    Nada ouvido neste período.
                </TextDefault>
            ) : (
                <View style={{ gap: 12, opacity: isPlaceholderData ? 0.5 : 1 }}>
                    {data.items.map((item) => (
                        <Pressable
                            key={`${item.rank}-${item.name}-${item.artist}`}
                            // onPress={() => Linking.openURL(item.url)}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <TextDefault
                                style={{
                                    width: 22,
                                    textAlign: "right",
                                    color: "#777",
                                    fontSize: 12,
                                }}
                            >
                                {String(item.rank).padStart(2, "0")}
                            </TextDefault>
                            <CoverThumb type={type} item={item} />
                            <View style={{ flex: 1 }}>
                                <TextDefault
                                    numberOfLines={1}
                                    style={{
                                        color: "#eee",
                                        fontSize: 14,
                                        fontWeight: "700",
                                    }}
                                >
                                    {item.name}
                                </TextDefault>
                                <TextDefault
                                    numberOfLines={1}
                                    style={{ color: "#989898", fontSize: 12 }}
                                >
                                    {item.artist ? `${item.artist} · ` : ""}
                                    {item.playcount.toLocaleString("pt-BR")} plays
                                </TextDefault>
                                <View
                                    style={{
                                        height: 3,
                                        borderRadius: 2,
                                        backgroundColor: "#2a2b2c",
                                        overflow: "hidden",
                                        marginTop: 6,
                                    }}
                                >
                                    <View
                                        style={{
                                            height: "100%",
                                            width: `${Math.max(4, Math.round((item.playcount / top) * 100))}%`,
                                            backgroundColor: "#8065ef",
                                        }}
                                    />
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}
