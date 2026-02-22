import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import api from "@/lib/api";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { displayPastRelativeTime } from "@/lib/util/time";
import TiptapRenderer from "@/components/home/card-content copy";
import { AlbumCard } from "@/components/home/album-section";

type review = {
    id: string;
    created_at: Date;
    ratings: any;
    review: string | null;
    total: any;
    shorten: string | null;
    content: any;
    published: boolean;
    updated_at: Date;
    album_id: string | null;
    user_id: string | null;
    Profile: {
        id: string;
        username: string;
        name: string;
        lowername: string;
        bio: string | null;
        pronouns: string | null;
        site: string | null;
        color: string | null;
        created_at: Date;
        public: boolean;
        favorites: {}[];
        verified: boolean;
        avatar_url: string | null;
        albuns: any[];
        artists: any[];
        location: string | null;
    };
};

type SpotifyAlbum = {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: Array<{
        url: string;
        height: number;
        width: number;
    }>;
    name: string;
    release_date: string;
    release_date_precision: string;
    type: string;
    uri: string;
    artists: {
        id: string;
        name: string;
    }[];
    tracks: Record<string, unknown>;
    copyrights: unknown[];
    external_ids: {
        upc: string;
    };
    genres: string[];
    label: string;
    popularity: number;
};

export default function Banner() {
    const { data: session } = authClient.useSession();

    const [reviewAlbum, setReviewAlbum] = useState<SpotifyAlbum | null>(null);
    const [bannerData, setBannerData] = useState<
        | {
              title: string;
              artist: string;
              src: string;
              darkVibrant: string;
              lightVibrant: string;
              textColor: string;
              album_id: string;
          }[]
        | null
    >(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fecthContent = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/banner`);
                setBannerData(response.data);
                // console.log(response.data);

                setLoading(false);
                // console.log("Content fetched successfully:", content.html);
            } catch (error) {
                console.error("Error fetching content:", error);
            }
        };

        fecthContent();
    }, []);

    return (
        <ScrollView
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={styles.main}
        >
            <View style={styles.banner}>
                {loading && (
                    <View style={styles.bannerCard}>
                        <Text style={styles.bannerTitle}>Carregando...</Text>
                    </View>
                )}
                {!loading &&
                    bannerData?.map((item, index) => (
                        <Pressable
                            style={({ pressed }) => [
                                {...styles.bannerCard, backgroundColor: item.darkVibrant},
                                pressed && styles.bannerCardPressed,
                            ]}
                            onPress={() => {
                                // Handle card press, e.g., navigate to album details
                            }}
                            key={index}
                        >
                            <View style={styles.bannerContent}>
                                <Text style={styles.bannerTitle}>
                                    {item.title}
                                </Text>
                                {/* <Text style={styles.bannerArtist}>
                                {bannerData.artist}
                            </Text> */}
                            </View>
                            <Image
                                source={{ uri: `${item.src}` }}
                                style={styles.bannerImage}
                            />
                        </Pressable>
                    ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    main: {
        width: "100%",
        backgroundColor: "transparent",
        flex: 1,
    },
    mainPressed: {
        backgroundColor: "#1e1e1e",
    },
    banner: {
        flexDirection: "row",
        gap: 8,
        padding: 16,
    },
    bannerCard: {
        height: 210,
        width: 130,
        backgroundColor: "#1e1e1e",
        borderRadius: 12,
        padding: 16,
        justifyContent: "flex-end",
    },
    bannerCardPressed: {
        opacity: 0.8,
    },
    bannerContent: {
        paddingVertical: 16,
    },
    bannerTitle: {
        color: "#eee",
        fontSize: 14,
        fontWeight: "700",
    },
    bannerImage: {
        width: 98,
        height: 98,
        borderRadius: 8,
        objectFit: "cover",
    },
});
