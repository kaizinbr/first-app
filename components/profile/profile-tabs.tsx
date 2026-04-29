import * as React from "react";
import { View, StyleSheet, RefreshControl, ScrollView } from "react-native";
import {
    Tabs,
    MaterialTabBar,
    MaterialTabItem,
} from "react-native-collapsible-tab-view";
import { UserProfile, Palette } from "@/lib/types";

import PostsRoute from "@/components/profile/posts";
import ProfileHeader from "@/components/profile/header";
import AboutRoute from "@/components/profile/about";
import FollowingRoute from "@/components/profile/following";
import FollowersRoute from "@/components/profile/followers";
import WishlistRoute from "@/components/profile/wishlist";
import FixedTopBar from "@/components/profile/fixed-top-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileTabs({
    data,
    dominantColor = "#161718",
    colors,
    itsUser = false,
    fetchProfileData,
}: {
    data: UserProfile;
    dominantColor: string;
    colors: Palette;
    itsUser?: boolean;
    fetchProfileData: () => Promise<void>;
}) {
    const insets = useSafeAreaInsets();

    const FIXED_BAR_HEIGHT = insets.top + 50;

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchProfileData();
        setRefreshing(false);
    }, [fetchProfileData]);

    const renderHeader = React.useCallback(() => {
        return (
            <ScrollView
                style={styles.headerWrapper}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <ProfileHeader
                    data={data}
                    dominantColor={dominantColor}
                    itsUser={itsUser}
                />
                <FixedTopBar
                    title={data.name || "Perfil"}
                    height={FIXED_BAR_HEIGHT}
                    dominantColor={dominantColor}
                    itsUser={itsUser}
                    username={data.username}
                />
            </ScrollView>
        );
    }, [data.name, FIXED_BAR_HEIGHT, refreshing, onRefresh]);

    const renderTabBar = React.useCallback(
        (props: any) => (
            <MaterialTabBar
                {...props}
                scrollEnabled={true}
                indicatorStyle={{ backgroundColor: "#8065ef", height: 2 }}
                style={{ backgroundColor: "#161718", elevation: 0, zIndex: 10 }}
                labelStyle={{
                    fontSize: 14,
                    fontWeight: "600",
                    fontFamily: "Walsheim"
                }}
                activeColor="#eee"
                inactiveColor="#777"
            />
        ),
        [],
    );

    return (
        <Tabs.Container
            renderHeader={renderHeader}
            renderTabBar={renderTabBar}
            headerContainerStyle={{
                shadowOpacity: 0,
                elevation: 0,
                backgroundColor: "transparent",
            }}
            minHeaderHeight={FIXED_BAR_HEIGHT}
        >
            <Tabs.Tab name="reviews" label="Reviews">
                <PostsRoute data={data} />
            </Tabs.Tab>
            <Tabs.Tab name="about" label="Mural">
                <AboutRoute data={data} />
            </Tabs.Tab>
            <Tabs.Tab name="list" label="Quero ouvir">
                <WishlistRoute data={data} />
            </Tabs.Tab>
            <Tabs.Tab name="following" label="Seguindo">
                <FollowingRoute data={data} />
            </Tabs.Tab>
            <Tabs.Tab name="followers" label="Seguidores">
                <FollowersRoute data={data} />
            </Tabs.Tab>
        </Tabs.Container>
    );
}

const styles = StyleSheet.create({
    headerWrapper: {
        width: "100%",
        // flex: 1,
    },
});
