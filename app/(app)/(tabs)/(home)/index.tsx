import {
    Text,
    Image,
    View,
    StyleSheet,
    ScrollView,
    Platform,
    Pressable,
    Animated,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import Feed from "@/components/home/feed";
import Banner from "@/components/home/banner";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

import { useState, useRef } from "react";
import HomeHeader from "@/components/home/header";

export default function Index() {

    const scrollOffsetY = useRef(new Animated.Value(0)).current;
    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
        { useNativeDriver: false } // Lembre-se que height e backgroundColor não aceitam useNativeDriver: true
    );

    return (
        <>
            <HomeHeader value={scrollOffsetY} />
            <Feed onScrollAnimado={handleScroll} />
        </>
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
