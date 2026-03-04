import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Tabs, MaterialTabBar } from "react-native-collapsible-tab-view";
import { UserProfile } from "@/lib/types";

import PostsRoute from "@/components/profile/posts";
import ProfileHeader from "@/components/profile/header";
import AboutRoute from "@/components/profile/about";
import FollowingRoute from "@/components/profile/following";
import FollowersRoute from "@/components/profile/followers";

// O seu novo componente otimizado
import FixedTopBar from "@/components/profile/fixed-top-bar";

export default function ProfileTabs({ data }: { data: UserProfile }) {

    // 1. A SOLUÇÃO DO CRASH: useCallback memoriza a renderização
    const renderHeader = React.useCallback(() => {
        return (
            <View style={styles.headerWrapper}>
                {/* O seu perfil que rola normalmente */}
                <ProfileHeader data={data} />
                
                {/* A barrinha inteligente que acabamos de criar */}
                <FixedTopBar title={data.name || "Perfil"} />
            </View>
        );
    }, [data.name]); // Só recria se o nome do usuário mudar

    const renderTabBar = React.useCallback((props: any) => (
        <MaterialTabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#00a8ff", height: 3 }}
            style={{ backgroundColor: "#161718" }}
            activeColor="#eee"
            inactiveColor="#777"
        />
    ), []);

    return (
        <Tabs.Container
            renderHeader={renderHeader}
            renderTabBar={renderTabBar}
            headerContainerStyle={{ shadowOpacity: 0, elevation: 0 }} // Remove a sombra padrão feia do Android
        >
            <Tabs.Tab name="reviews" label="Reviews">
                <PostsRoute data={data} />
            </Tabs.Tab>
            <Tabs.Tab name="about" label="Sobre">
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
        flex: 1,
    },
});