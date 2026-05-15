import { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomePage from "@/components/test/main";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";

export default function Index() {
    const scrollOffsetY = useSharedValue(0);
    const insets = useSafeAreaInsets();

    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollOffsetY.value = event.contentOffset.y;
        },
    });

    const statusBarOpacityStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            scrollOffsetY.value,
            [300, 374],
            [0, 1],
            Extrapolation.CLAMP,
        ),
    }));

    return (
        <View style={styles.container}>
            <HomePage
                onScrollAnimado={handleScroll}
                scrollOffsetY={scrollOffsetY}
            />
            <Animated.View
                style={[
                    styles.statusBarBg,
                    {
                        height: insets.top,
                    },
                    statusBarOpacityStyle,
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