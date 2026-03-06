import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import api from "@/lib/api";
import { Image } from "expo-image";
import { useEffect, useState, useRef } from "react";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { renderItem } from "@/components/home/banner/render-item";
import * as React from "react";

import { selectRightColor } from "@/lib/util/selectRightColor";
import { getColors } from "react-native-image-colors";
import { Palette } from "@/lib/types";

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
    const { width } = useWindowDimensions();
    const progress = useSharedValue<number>(0);

    const carouselRef = useRef<ICarouselInstance>(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentColor, setCurrentColor] = useState("#161718");

    const [reviewAlbum, setReviewAlbum] = useState<SpotifyAlbum | any>(null);
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
    const [colors, setColors] = useState<Palette | any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fecthContent = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/banner`);
                setBannerData(response.data);
                

                setLoading(false);
                // console.log("Content fetched successfully:", content.html);
            } catch (error) {
                console.error("Error fetching content:", error);
            }
        };

        fecthContent();
    }, []);

    useEffect(() => {
        console.log("Current index:", currentIndex);
        // setCurrentIndex(currentIndex);
    }, [currentIndex, bannerData]);

    return (
        <>
            {loading ? (
                <View style={[styles.banner, { width }]}>
                    <Text style={{ color: "#eee" }}>Carregando...</Text>
                </View>
            ) : (
                <View id="carousel-component">
                    <Carousel
                        ref={carouselRef}
                        autoPlayInterval={2000}
                        data={bannerData || []}
                        loop={true}
                        pagingEnabled={true}
                        snapEnabled={true}
                        style={{
                            width: width,
                            height: 258,
                        }}
                        width={width}
                        mode="parallax"
                        modeConfig={{
                            parallaxScrollingScale: 0.9,
                            parallaxScrollingOffset: 50,
                        }}
                        onProgressChange={(
                            offsetProgress,
                            absoluteProgress,
                        ) => {
                            progress.value = absoluteProgress;
                            const newIndex = Math.round(absoluteProgress);
                            if (newIndex !== currentIndex) {
                                setCurrentIndex(newIndex);
                            }
                        }}
                        renderItem={renderItem({
                            rounded: true,
                            colorFill: true,
                        })}
                    />
                </View>
            )}
        </>
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
        // width: width,
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
