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
import { UserProfile, Review } from "@/lib/types";
import { Tabs } from "react-native-collapsible-tab-view";
import { ArrowRightUp } from "@solar-icons/react-native/Linear";
import { Image } from "expo-image";

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
                            <Text style={styles.title}>Bio</Text>
                            <Text style={styles.textDefault}>{data.bio}</Text>
                        </View>
                    )}
                    {data.location && (
                        <View>
                            <Text style={styles.title}>Location</Text>
                            <Text style={styles.textDefault}>
                                {data.location}
                            </Text>
                        </View>
                    )}

                    <View>
                        <Text style={styles.title}>Membro desde</Text>
                        <Text style={styles.textDefault}>
                            {new Date(data.created_at).toLocaleDateString(
                                process.env.LOCALE || "pt-BR",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                },
                            )}
                        </Text>
                    </View>
                </View>
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
                        <Text style={styles.textDefault}>{data.site}</Text>
                        <ArrowRightUp size={18} color="#eee" />
                    </Pressable>
                )}
                {data.artists.length > 0 && (
                                <View style={styles.sec}>
                                    <Text style={styles.title}>
                                        Artistas favoritos
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            gap: GAP,
                                            marginTop: 8,
                                            width: "100%",
                                        }}
                                    >
                                        {data.artists.map(
                                            (artist: any) => (
                                                <Image
                                                    key={artist.id}
                                                    source={{ uri: artist.src }}
                                                    style={{
                                                        width: itemSize,
                                                        height: itemSize,
                                                        borderRadius: 9999,
                                                    }}
                                                    contentFit="cover"
                                                />
                                            ),
                                        )}
                                    </View>
                                </View>
                            )}
                {data.albuns.length > 0 && (
                        <View style={styles.sec}>
                            {data.albuns.length > 0 && (
                                <View style={{ width: "100%" }}>
                                    <Text style={styles.title}>
                                        Álbuns favoritos
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            gap: GAP,
                                            marginTop: 8,
                                            width: "100%",
                                        }}
                                    >
                                        {data.albuns.map(
                                            (album: any) => (
                                                <Image
                                                    key={album.id}
                                                    source={{ uri: album.src }}
                                                    style={{
                                                        width: itemSize,
                                                        height: itemSize,
                                                        borderRadius: 8,
                                                    }}
                                                    contentFit="cover"
                                                />
                                            ),
                                        )}
                                    </View>
                                </View>
                            )}
                            
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
        gap: 16,
    },
});
