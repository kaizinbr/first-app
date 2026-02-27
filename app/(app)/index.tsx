import {
    Text,
    Image,
    View,
    StyleSheet,
    ScrollView,
    Platform,
    Pressable,
    StatusBar as RNStatusBar,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import Feed from "@/components/home/feed";
import Banner from "@/components/home/banner";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

import { useState } from "react";

export default function Index() {
    const { data: session } = authClient.useSession();
    const statusHeight =
        Platform.OS === "android" ? RNStatusBar.currentHeight || 0 : 44; // iPhone com notch

    const [scrolled, setScrolled] = useState(false);
    const LIMIT = 120; // px para mudar o estilo da status bar

    return (
        <>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onScroll={(e) => {
                    const y = e.nativeEvent.contentOffset.y;
                    setScrolled(y > LIMIT);
                }}
                scrollEventThrottle={16}
                // style={{
                //     width: "100%",
                //     height: "100%",
                //     position: "absolute",
                //     top: statusHeight,
                //     left: 0,
                //     overflow: "visible",
                // }}
            >
                <View style={styles.header}>
                    <View style={styles.colorOne}></View>
                </View>
                <SafeAreaView>
                    <View style={styles.main}>
                        <Text style={styles.title}>
                            Olá, {session?.user?.name || "usuário"}!
                        </Text>
                        <Banner />
                        <Link
                            href={{
                                pathname: "/create/review/[id]",
                                params: { id: "2ffVa2UhHUDwMHnr685zJ4" },
                            }}
                            style={{
                                marginTop: 16,
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                backgroundColor: "#1f64d4",
                                borderRadius: 8,
                                alignSelf: "flex-start",
                                color: "#eeeeee",
                            }}
                        >
                            Criar Resenha
                        </Link>
                        <Text style={styles.h2}>O que está rolando?</Text>
                        <Feed />
                        {/* <Image
                        source={require("@/assets/images/img1.png")}
                        style={styles.image}
                    /> */}
                    </View>
                </SafeAreaView>
            </ScrollView>
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
        marginTop: 32,
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
