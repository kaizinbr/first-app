import {
    View,
    Text,
    Button,
    StyleSheet,
    ScrollView,
    Pressable,
    FlatList,
    useWindowDimensions,
} from "react-native";
import TextDefault from "@/components/core/text-core";
import { UserProfile, Review } from "@/lib/types";
import { Tabs } from "react-native-collapsible-tab-view";
import { ArrowRightUp } from "@solar-icons/react-native/Linear";
import { Image } from "expo-image";
import LyricsCard from "@/components/profile/lyrics-card";

import { SimpleGrid } from "react-native-super-grid";

export default function AboutRoute({ data }: { data: UserProfile }) {
    const GAP = 8;
    const COLUMNS = 4; // quantas colunas quer

    const { width } = useWindowDimensions();
    const itemSize = (width - 48 - GAP * (COLUMNS + 1)) / COLUMNS;
    return (
        <Tabs.ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                width: "100%",
                padding: 16,
                paddingBottom: 80,
                paddingTop: 448,
            }}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.scene}>
                <View style={styles.sec}>
                    {data.bio && (
                        <View>
                            <TextDefault style={styles.title}>Bio</TextDefault>
                            <TextDefault style={styles.textDefault}>
                                {data.bio}
                            </TextDefault>
                        </View>
                    )}
                    {data.location && (
                        <View>
                            <TextDefault style={styles.title}>Location</TextDefault>
                            <TextDefault style={styles.textDefault}>
                                {data.location}
                            </TextDefault>
                        </View>
                    )}

                    <View>
                        <TextDefault style={styles.title}>Membro desde</TextDefault>
                        <TextDefault style={styles.textDefault}>
                            {new Date(data.created_at).toLocaleDateString(
                                process.env.LOCALE || "pt-BR",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                },
                            )}
                        </TextDefault>
                    </View>
                </View>

                {data.lyrics !== null && (
                    <LyricsCard saved={data.lyrics as any} />
                )}

                {data.site && (
                    <Pressable
                        style={[
                            styles.sec,
                            {
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            },
                        ]}
                        onPress={() => {
                            // Lógica para abrir o site, por exemplo, usando Linking
                        }}
                    >
                        <TextDefault style={styles.textDefault}>
                            {data.site}
                        </TextDefault>
                        <ArrowRightUp size={18} color="#eee" />
                    </Pressable>
                )}

                {data.albuns.length > 0 && (
                    <View
                        style={[
                            styles.sec,
                            {
                                paddingTop: 16,
                                paddingBottom: 4,
                                paddingHorizontal: 8,
                                borderRadius: 12,
                                gap: 8,
                            },
                        ]}
                    >
                        <TextDefault style={[styles.title, { marginLeft: 8 }]}>
                            Álbuns Favoritos
                        </TextDefault>
                        <SimpleGrid
                            itemDimension={70}
                            data={data.albuns}
                            renderItem={({ item }) => (
                                <Image
                                    source={{ uri: item.src }}
                                    style={{
                                        width: "100%",
                                        // height: 80,
                                        aspectRatio: 1,
                                        flex: 1,
                                        borderRadius: 8,
                                    }}
                                />
                            )}
                            style={{ padding: 0 }}
                            listKey="albuns"
                        />
                    </View>
                )}

                {data.artists.length > 0 && (
                    <View
                        style={[
                            styles.sec,
                            {
                                paddingTop: 16,
                                paddingBottom: 4,
                                paddingHorizontal: 8,
                                borderRadius: 12,
                                gap: 8,
                            },
                        ]}
                    >
                        <TextDefault style={[styles.title, { marginLeft: 8 }]}>
                            Artistas favoritos
                        </TextDefault>
                        <SimpleGrid
                            itemDimension={70}
                            data={data.artists}
                            renderItem={({ item }) => (
                                <Image
                                    source={{ uri: item.src }}
                                    style={{
                                        width: "100%",
                                        // height: 80,
                                        aspectRatio: 1,
                                        flex: 1,
                                        borderRadius: 999,
                                    }}
                                />
                            )}
                            style={{ padding: 0 }}
                            listKey="artists"
                        />
                    </View>
                )}
            </View>
        </Tabs.ScrollView>
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,

        gap: 16,
        width: "100%",
    },

    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 16,
        marginTop: 4,
    },
    title: {
        color: "#989898",
        fontSize: 14,
        fontWeight: "bold",
    },
    sec: {
        backgroundColor: "#1b1c1d",
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
});
