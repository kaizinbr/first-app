import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Tabs, MaterialTabBar } from "react-native-collapsible-tab-view";
import { UserProfile, Palette } from "@/lib/types";

import PostsRoute from "@/components/profile/posts";
import ProfileHeader from "@/components/profile/header";
import AboutRoute from "@/components/profile/about";
import FollowingRoute from "@/components/profile/following";
import FollowersRoute from "@/components/profile/followers";
import FixedTopBar from "@/components/profile/fixed-top-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileTabs({
    data,
    dominantColor = "#161718",
    colors,
    itsUser = false,
}: {
    data: UserProfile;
    dominantColor: string;
    colors: Palette;
    itsUser?: boolean;
}) {
    const insets = useSafeAreaInsets();

    const FIXED_BAR_HEIGHT = insets.top + 50;

    const renderHeader = React.useCallback(() => {
        return (
            <View style={styles.headerWrapper}>
                <ProfileHeader
                    data={data}
                    dominantColor={dominantColor}
                    itsUser={itsUser}
                />
                <FixedTopBar
                    title={data.name || "Perfil"}
                    height={FIXED_BAR_HEIGHT}
                    dominantColor={dominantColor}
                />
            </View>
        );
    }, [data.name, FIXED_BAR_HEIGHT]);

    const renderTabBar = React.useCallback(
        (props: any) => (
            <MaterialTabBar
                {...props}
                scrollEnabled={true}
                indicatorStyle={{ backgroundColor: "#8065ef", height: 3 }}
                
                style={{ backgroundColor: "#161718", elevation: 0, zIndex: 10 }}
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
            headerContainerStyle={{ shadowOpacity: 0, elevation: 0 }}
            minHeaderHeight={FIXED_BAR_HEIGHT}
        >
            <Tabs.Tab name="reviews" label="Reviews">
                <PostsRoute data={data} />
            </Tabs.Tab>
            <Tabs.Tab name="about" label="Mural">
                <AboutRoute data={data} />
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
