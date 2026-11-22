import { View, StyleSheet, Pressable } from "react-native";
import TextDefault from "@/components/core/text-core";
import { UserProfile } from "@/lib/types";
import { Tabs } from "react-native-collapsible-tab-view";
import { ArrowRightUpIcon } from "@solar-icons/react-native/linear/arrow-right-up";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useState } from "react";
import { useLastfm } from "@/lib/queries/lastfm";
import {
    useLastfmGenres,
    useLastfmSummary,
    useLastfmTop,
} from "@/lib/queries/lastfm-stats";
import type { LastfmRange } from "@/lib/lastfm-types";
import PeriodChips from "@/components/profile/lastfm/period-chips";
import DateRangePicker from "@/components/profile/lastfm/date-range-picker";
import StatsSummary from "@/components/profile/lastfm/stats-summary";
import TopList from "@/components/profile/lastfm/top-list";
import GenreList from "@/components/profile/lastfm/genre-list";

export default function LastFmRoute({ data }: { data: UserProfile }) {
    const { data: lastfmData } = useLastfm(data.username);

    const [range, setRange] = useState<LastfmRange>({ period: "1month" });
    const [custom, setCustom] = useState(false);

    const artists = useLastfmTop(data.username, "artists", range);
    const albums = useLastfmTop(data.username, "albums", range);
    const tracks = useLastfmTop(data.username, "tracks", range);
    const genres = useLastfmGenres(data.username, range);
    const summary = useLastfmSummary(data.username, range);

    return (
        <Tabs.ScrollView
            contentContainerStyle={{
                width: "100%",
                padding: 16,
                paddingBottom: 80,
            }}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.scene}>
                {lastfmData && (
                    <View style={styles.sec}>
                        <TextDefault style={styles.title}>
                            Last.fm de {data.name}
                        </TextDefault>
                        <View style={styles.lastProfile}>
                            <Image
                                source={{ uri: lastfmData.image[3]["#text"] }}
                                style={styles.lastProfileImage}
                            />
                            <View style={{ marginLeft: 8, flex: 1, gap: 4 }}>
                                <TextDefault style={styles.lastProfileText}>
                                    {lastfmData.name}
                                    <ArrowRightUpIcon size={14} color="#eee" />
                                </TextDefault>
                                <TextDefault style={styles.lastProfileSubText}>
                                    Entrou em{" "}
                                    {new Date(
                                        lastfmData.registered.unixtime * 1000,
                                    ).toLocaleDateString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </TextDefault>
                                <TextDefault style={styles.lastProfileSubText}>
                                    {Number(lastfmData.playcount).toLocaleString(
                                        "pt-BR",
                                    )}{" "}
                                    scrobbles
                                </TextDefault>
                            </View>
                        </View>
                    </View>
                )}

                <PeriodChips
                    range={range}
                    custom={custom}
                    onSelectPeriod={(period) => {
                        setCustom(false);
                        setRange({ period });
                    }}
                    onSelectCustom={() => setCustom(true)}
                />

                {custom && (
                    <DateRangePicker
                        minimumDate={
                            lastfmData
                                ? new Date(lastfmData.registered.unixtime * 1000)
                                : undefined
                        }
                        onApply={setRange}
                    />
                )}

                <StatsSummary
                    scrobbles={summary.data}
                    artists={artists.data?.total}
                    albums={albums.data?.total}
                    tracks={tracks.data?.total}
                    isPlaceholderData={
                        summary.isPlaceholderData ||
                        artists.isPlaceholderData ||
                        albums.isPlaceholderData ||
                        tracks.isPlaceholderData
                    }
                />

                <TopList
                    title="Artistas"
                    type="artists"
                    data={artists.data}
                    isLoading={artists.isLoading}
                    isError={artists.isError}
                    isPlaceholderData={artists.isPlaceholderData}
                />
                <TopList
                    title="Álbuns"
                    type="albums"
                    data={albums.data}
                    isLoading={albums.isLoading}
                    isError={albums.isError}
                    isPlaceholderData={albums.isPlaceholderData}
                />
                <TopList
                    title="Músicas"
                    type="tracks"
                    data={tracks.data}
                    isLoading={tracks.isLoading}
                    isError={tracks.isError}
                    isPlaceholderData={tracks.isPlaceholderData}
                />
                <GenreList
                    genres={genres.data}
                    isLoading={genres.isLoading}
                    isError={genres.isError}
                    isPlaceholderData={genres.isPlaceholderData}
                />

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
                            data.site && Linking.openURL(data.site);
                        }}
                    >
                        <TextDefault style={styles.textDefault}>
                            {data.site}
                        </TextDefault>
                        <ArrowRightUpIcon size={18} color="#eee" />
                    </Pressable>
                )}
            </View>
        </Tabs.ScrollView>
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        paddingTop: 16,
        gap: 16,
        width: "100%",
    },
    textDefault: {
        color: "#eee",
        fontSize: 16,
        marginTop: 4,
    },
    title: {
        color: "#989898",
        fontSize: 14,
        fontWeight: "bold",
    },
    sec: {
        backgroundColor: "#212223",
        padding: 16,
        borderRadius: 18,
        gap: 8,
    },
    lastProfile: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    lastProfileImage: {
        width: 64,
        height: 64,
        borderRadius: 50,
    },
    lastProfileText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#eee",
        paddingBottom: 4,
    },
    lastProfileSubText: {
        fontSize: 14,
        color: "#989898",
        paddingVertical: 2,
        paddingHorizontal: 8,
        backgroundColor: "#2a2b2c",
        borderRadius: 8,
        alignSelf: "flex-start",
    },
});
