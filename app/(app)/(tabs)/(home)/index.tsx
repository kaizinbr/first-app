import { useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Feed from "@/components/home/feed";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
    const scrollOffsetY = useRef(new Animated.Value(0)).current;

    const insets = useSafeAreaInsets();

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
        { useNativeDriver: false }
    );

    const statusBarOpacity = scrollOffsetY.interpolate({
        inputRange: [300, 374],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    return (
        <View style={styles.container}>
            <Feed
                onScrollAnimado={handleScroll}
                scrollOffsetY={scrollOffsetY}
            />
            <Animated.View
                style={[
                    styles.statusBarBg,
                    {
                        height: insets.top,
                        opacity: statusBarOpacity,
                    },
                ]}
                pointerEvents="none"
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        alignItems: "center",
        width: "100%",
        backgroundColor: "transparent",
        color: "#eeeeee",
    },
    statusBarBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#161718",
        zIndex: 10,
    },
    main: {
        flex: 1,
        width: "100%",
    },
    headerWrapper: {
        width: "100%",
        height: "100%",
    },
    header: {
        width: "100%",
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
    title: {
        fontSize: 24,
        fontWeight: "800",
        textAlign: "left",
        // marginTop: 32,
        color: "#eeeeee",
        paddingHorizontal: 16,
    },
    h2: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "left",
        marginTop: 32,
        color: "#eeeeee",
    },
    feed: {
        gap: 8,
        marginTop: 20,
    },
    feedCard: {
        height: 120,
        width: "100%",
        backgroundColor: "#1e1e1e",
        borderRadius: 8,
    },
    image: {
        width: "100%",
        height: 300,
        marginTop: 20,
        resizeMode: "contain",
    },
});
