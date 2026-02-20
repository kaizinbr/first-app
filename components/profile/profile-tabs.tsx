import * as React from "react";
import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const PostsRoute = () => (
    <View style={styles.scene}>
        <Text>Posts</Text>
    </View>
);

const LikesRoute = () => (
    <View style={styles.scene}>
        <Text>Likes</Text>
    </View>
);

const MediaRoute = () => (
    <View style={styles.scene}>
        <Text>Media</Text>
    </View>
);

export default function ProfileTabs() {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "reviews", title: "Reviews" },
        { key: "about", title: "Sobre" },
        { key: "following", title: "Seguindo" },
        { key: "followers", title: "Seguidores" },
    ]);

    const renderScene = SceneMap({
        reviews: PostsRoute,
        about: MediaRoute,
        following: LikesRoute,
        followers: LikesRoute,
    });

    return (
        <TabView
            navigationState={{ index, routes }}
            style={{ marginTop: 20, flex: 1 }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(props) => (
                <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: "#000", height: 3 }}
                    style={{ backgroundColor: "white", elevation: 0 }}
                    activeColor="#000"
                    inactiveColor="#777"
                    // labelStyle={{ fontWeight: "600" }}
                />
            )}
        />
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
