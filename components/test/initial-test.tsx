import * as React from "react";
import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import { UserProfile } from "@/lib/types";
import { Tabs, MaterialTabBar } from "react-native-collapsible-tab-view";

import PostsRoute from "@/components/profile/posts";
import ProfileHeader from "@/components/profile/header";
import AboutRoute from "@/components/profile/about";
import FollowingRoute from "@/components/profile/following";
import FollowersRoute from "@/components/profile/followers";

export function Header() {
    return (
        <View style={styles.scene1}>
            <View style={styles.header}>
                                <View style={styles.colorOne}></View>
                            </View>
        </View>
    );
}
export default function Inicio({ data }: { data: UserProfile }) {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "reviews", title: "Reviews" },
        { key: "about", title: "Sobre" },
        { key: "following", title: "Seguindo" },
        { key: "followers", title: "Seguidores" },
    ]);

    const renderTabBar = (props: any) => (
        <MaterialTabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#eee", height: 3 }}
            style={{ backgroundColor: "#161718" }}
            activeColor="#eee"
            inactiveColor="#777"
        />
    );

    const renderScene = React.useCallback(
        ({ route }: any) => {
            switch (route.key) {
                case "reviews":
                    return <PostsRoute data={data} />;
                case "about":
                    return <AboutRoute data={data} />;
                case "following":
                    return <FollowingRoute data={data} />;
                case "followers":
                    return <FollowersRoute data={data} />;
                default:
                    return null;
            }
        },
        [data],
    );

    return (
        <Tabs.Container
            renderHeader={() => <ProfileHeader data={data} />} 
            renderTabBar={renderTabBar}
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
    scene: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    headerContainer: {
        padding: 20,
        backgroundColor: "#161718", // Cor de fundo do header
        // Adicione o resto do seu estilo de header aqui
    },
    textDefault: {
        color: "#eee", 
        fontSize: 16,
    },

    scene1: {
        padding: 20,
        backgroundColor: "#161718",
    },

    header: {
        padding: 16,
        width: "100%",
        color: "#eee",
        borderRadius: 8,
        height: "100%",
        position: "absolute",
        top: 0,
        zIndex: -10,
        backgroundColor: "transparent",
        marginTop: -100,
    },
    colorOne: {
        width: 150,
        height: 150,
        borderRadius: 9999,
        position: "absolute",
        top: -50,
        left: -50,
        backgroundColor: "#1f64d4",
        filter: "blur(100px)",
    },
});
