import TextDefault from "@/components/core/text-core";
import api from "@/lib/api";
import { Palette, UserProfile } from "@/lib/types";
import { selectBackgroundColor } from "@/lib/util/selectRightColor";
import { getPalette } from "expo-color-thief-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";
import type { ColorThiefColorData } from "expo-color-thief-native";

import PlayingOnLastFM from "@/components/profile/last-fm-card";
import ProfileHeaderBG from "@/components/profile/profile-header-bg";
import { VerifiedCheckIcon } from "@solar-icons/react-native/bold/verified-check";
import { Pressable, StyleSheet, Modal, View } from "react-native";

export default function ProfileImage({ data }: { data: UserProfile }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <View style={styles.wrapper}>
                <Pressable onPress={() => setShowModal(true)}>
                    <Image
                        source={{ uri: data.avatar_url }}
                        style={[
                            styles.avatar,
                            {
                                width: 112,
                                height: 112,
                                borderRadius: 112 * 0.306,
                            },
                        ]}
                    />
                </Pressable>
                {data.pronouns && (
                    <View
                        style={[
                            styles.pronouns,
                            // { backgroundColor: dominantColor },
                        ]}
                    >
                        <TextDefault style={styles.pronounstext}>
                            {data.pronouns}
                        </TextDefault>
                    </View>
                )}
            </View>

            
            <Modal
                visible={showModal}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowModal(false)}
            >
                <Pressable
                    style={styles.modalBackground}
                    onPress={() => setShowModal(false)}
                >
                    <Image
                        source={{ uri: data.avatar_url}}
                        style={styles.modalImage}
                    />
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexDirection: "column",
        marginBottom: 28,
    },
    pronouns: {
        color: "#929292",
        fontSize: 12,
        marginTop: 4,
        position: "absolute",
        bottom: -20,
        zIndex: 10,
        backgroundColor: "#8065ef",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    pronounstext: {
        color: "#eee",
        fontSize: 12,
        fontWeight: "bold",
    },
    avatar: {
        backgroundColor: "#bbb",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(22,23,24,0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    modalImage: {
        width: "100%",
        height: "auto",
        aspectRatio: 1,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
});
