import { UserProfile } from "@/lib/types";

import { useRouter } from "expo-router";

import { Pressable, StyleSheet, View } from "react-native";
import { useHeaderMeasurements } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ShareBtn from "@/components/core/share-btn";
import ProfileHeader from "@/components/profile/profile-header";
import { SettingsIcon } from "@solar-icons/react-native/linear/settings";
import { AltArrowLeftIcon } from "@solar-icons/react-native/linear/alt-arrow-left";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";
import { darkenColor } from "@/lib/util/workWithColors";
import { selectAlbumColor } from "@/lib/util/selectRightColor";

export default function Header({
    data,
    palette,
    itsUser = false,
}: {
    data: UserProfile;
    palette?: any;
    itsUser?: boolean;
}) {
    const insets = useSafeAreaInsets();

    const mainColor = selectAlbumColor(palette).hex;
    const { top, height } = useHeaderMeasurements();

    const router = useRouter();

    const fixedBarStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: -top.value }],
        };
    });

    const contentOpacityStyle = useAnimatedStyle(() => {
        const maxCollapse = height - (insets.top + 50);

        return {
            opacity: interpolate(
                -top.value,
                [maxCollapse - 80, maxCollapse],
                [1, 0],
                Extrapolation.CLAMP,
            ),
        };
    });

    return (
        <>
            <Animated.View style={[styles.headerWrapper]}>
                <ProfileHeader
                    data={data}
                    itsUser={itsUser}
                    style={contentOpacityStyle}
                    palette={palette}
                />
                <Animated.View
                    style={[
                        styles.fixedTopBar,
                        { height: insets.top + 50 },
                        fixedBarStyle,
                    ]}
                >

                    <View
                        style={[
                            styles.fixedTopBarContent,
                            { marginTop: insets.top },
                        ]}
                    >
                        <Pressable
                            style={[
                                styles.backButton,
                                {
                                    backgroundColor: darkenColor(
                                        mainColor,
                                        0.3,
                                    ),
                                },
                            ]}
                            onPress={() => router.back()}
                        >
                            <AltArrowLeftIcon
                                style={{ left: -2 }}
                                size={24}
                                strokeWidth={3}
                                color="#eee"
                            />
                        </Pressable>

                        {itsUser ? (
                            <>
                                <View
                                    style={[
                                        styles.fixedBtn,
                                        {
                                            backgroundColor: darkenColor(
                                                mainColor,
                                                0.3,
                                            ),
                                        },
                                    ]}
                                >
                                    <ShareBtn
                                        type="profile"
                                        url={`https://whistle.kaizin.work/${data.username}`}
                                    />
                                </View>
                                <View
                                    style={[
                                        styles.fixedBtn,
                                        {
                                            right: 16,
                                            backgroundColor: darkenColor(
                                                mainColor,
                                                0.3,
                                            ),
                                        },
                                    ]}
                                >
                                    <Pressable
                                        style={[styles.confBtn]}
                                        onPress={() =>
                                            router.push("/settings/menu")
                                        }
                                    >
                                        <SettingsIcon size={24} color="#eee" />
                                    </Pressable>
                                </View>
                            </>
                        ) : (
                            <View 
                                    style={[
                                        styles.fixedBtn,
                                        {
                                            right: 16,
                                            backgroundColor: darkenColor(
                                                mainColor,
                                                0.3,
                                            ),
                                        },
                                    ]}>
                                <ShareBtn
                                    type="profile"
                                    url={`https://whistle.kaizin.work/${data.username}`}
                                />
                            </View>
                        )}
                    </View>
                </Animated.View>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    scene: {
        padding: 20,
        // backgroundColor: "#161718",
    },

    header: {
        padding: 16,
        width: "100%",
        borderRadius: 8,
        backgroundColor: "transparent",
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
        position: "absolute",
        left: 16,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
        backgroundColor: "rgba(22,23,24,0.7)",
        alignItems: "center",
        borderRadius: 999,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    fixedBtn: {
        position: "absolute",
        right: 64,
        zIndex: 11,
        width: 40,
        height: 40,
        justifyContent: "center",
        backgroundColor: "rgba(22,23,24,0.7)",
        alignItems: "center",
        borderRadius: 999,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    confBtn: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    smallTitle: {
        color: "#eee",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "Walsheim",
    },
});
