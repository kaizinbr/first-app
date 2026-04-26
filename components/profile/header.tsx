import { Image } from "expo-image";
import { UserProfile } from "@/lib/types";

import { useRouter } from "expo-router";

import * as React from "react";
import {
    View,
    Text,
    useWindowDimensions,
    StyleSheet,
    Pressable,
} from "react-native";
import {
    Tabs,
    MaterialTabBar,
    useHeaderMeasurements,
} from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import {
    AltArrowLeft,
    Settings,
    Share,
} from "@solar-icons/react-native/Outline";
import { SettingsMinimalistic } from "@solar-icons/react-native/Bold";
import ProfileHeader from "@/components/profile/profile-header";
import ShareBtn from "@/components/core/share-btn";

export default function Header({
    data,
    dominantColor = "#161718",
    itsUser = false,
}: {
    data: UserProfile;
    dominantColor?: string;
    itsUser?: boolean;
}) {
    const insets = useSafeAreaInsets();

    const { top } = useHeaderMeasurements();

    const router = useRouter();

    const fixedBarStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: -top.value }],
        };
    });

    const bgOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                -top.value,
                [100, 160],
                [0, 1],
                Extrapolation.CLAMP,
            ),
        };
    });

    const titleOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                -top.value,
                [130, 180],
                [0, 1],
                Extrapolation.CLAMP,
            ),
        };
    });

    return (
        <View style={styles.headerWrapper}>
            <ProfileHeader
                data={data}
                dominantColor={dominantColor}
                itsUser={itsUser}
            />

            <Animated.View
                style={[
                    styles.fixedTopBar,
                    { height: insets.top + 50 },
                    fixedBarStyle,
                ]}
            >
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        styles.fixedBg,
                        bgOpacityStyle,
                        { backgroundColor: dominantColor },
                    ]}
                />

                <View
                    style={[
                        styles.fixedTopBarContent,
                        { marginTop: insets.top },
                    ]}
                >
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <AltArrowLeft size={32} color="#eee" />
                    </Pressable>

                    <Animated.Text
                        style={[styles.smallTitle, titleOpacityStyle]}
                    >
                        {data.name || "Perfil"}
                    </Animated.Text>

                    {itsUser ? (
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 8,
                                zIndex: 1000,
                            }}
                        >
                            <ShareBtn
                                type="profile"
                                url={`https://whistle.kaizin.work/${data.username}`}
                            />
                            <Pressable
                                style={[styles.confBtn, { width: 30 }]}
                                onPress={() => router.push("/settings/menu")}
                            >
                                <Settings size={28} color="#eee" />
                            </Pressable>
                        </View>
                    ) : (
                        <ShareBtn
                            type="profile"
                            url={`https://whistle.kaizin.work/${data.username}`}
                        />
                    )}
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    scene: {
        padding: 20,
        backgroundColor: "#161718",
    },

    header: {
        padding: 16,
        width: "100%",
        color: "#eee",
        borderRadius: 8,
    },
    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 16,
    },
    headerWrapper: {
        width: "100%",
        // height: 300,
        // backgroundColor: "#161718",
    },
    fixedTopBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99,
    },
    fixedBg: {
        // backgroundColor: "#161718", // Cor da header quando o usuário descer tudo
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    fixedTopBarContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    confBtn: {
        width: 40,
        height: 30,
        justifyContent: "center",
        alignItems: "flex-end",
    },
    smallTitle: {
        color: "#eee",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "Walsheim",
    },
});
