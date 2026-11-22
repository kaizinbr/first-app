import {
    Text,
    Image,
    View,
    StyleSheet,
    Modal,
    Platform,
    Pressable,
    StatusBar as RNStatusBar,
    Dimensions,
} from "react-native";

import { useCallback, useEffect, useState } from "react";

import Animated, {
    useAnimatedStyle,
    useAnimatedScrollHandler,
    useSharedValue,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { selectAlbumColor } from "@/lib/util/selectRightColor";
import { ColorThiefColorData } from "@/modules/expo-color-thief-native/src";

export default function AlbumHeader({
    maxHeight,
    data,
    headerContentStyle,
    palette,
}: {
    maxHeight: number;
    data: any;
    headerContentStyle?: any;
    palette: ColorThiefColorData[];
}) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Animated.View
                style={[
                    styles.container,
                    {
                        // minHeight: 300,
                        // height: maxHeight,
                        justifyContent: "flex-end",
                        // paddingBottom: 24,
                        backgroundColor: selectAlbumColor(palette).hex,
                    },
                ]}
            >
                <Animated.View style={headerContentStyle}>
                    <Pressable onPress={() => setShowModal(true)}>
                        <Image
                            source={{ uri: data.images[0].url }}
                            style={styles.albumArt}
                        />
                    </Pressable>
                </Animated.View>

                <View
                    style={{
                        position: "absolute",
                        bottom: 0 -165,
                        height: 330,
                        zIndex: 1,
                        width: "100%",
                    }}
                >
                    <LinearGradient
                        colors={["transparent", selectAlbumColor(palette).hex]}
                        style={{
                            height: 162,
                            width: "100%",
                        }}
                    />
                    <View
                        style={{
                            height: 16,
                            width: "100%",
                            backgroundColor: selectAlbumColor(palette).hex,
                        }}
                    />
                    <LinearGradient
                        colors={[selectAlbumColor(palette).hex, "transparent"]}
                        style={{
                            height: 162,
                            width: "100%",
                        }}
                    />
                </View>
            </Animated.View>

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
                        source={{ uri: data.images[0].url }}
                        style={styles.modalImage}
                    />
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    albumArt: {
        width: "100%",
        height: "auto",
        aspectRatio: 1,
        minHeight: 200,
        minWidth: 200,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    albumType: { color: "#c4c4c4", fontSize: 12, fontWeight: "500" },
    albumTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "900",
        marginTop: 4,
    },
    albumArtist: {
        color: "#ccc",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 4,
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
