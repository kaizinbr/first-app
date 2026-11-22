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
import Animated, {
    useAnimatedStyle,
    useAnimatedScrollHandler,
    useSharedValue,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import TextDefault from "@/components/core/text-core";
import { useCallback, useEffect, useState } from "react";

export default function AlbumHeader({
    maxHeight,
    data,
    headerContentStyle,
}: any) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Animated.View
                style={[
                    styles.container,
                    {
                        minHeight: 300,
                        justifyContent: "flex-end",
                    },
                ]}
            >
                <Animated.View >
                    <Pressable onPress={() => setShowModal(true)}>
                        <Image
                            source={{ uri: data.images[0].url }}
                            style={styles.artist}
                        />
                    </Pressable>
                    {/* <TextDefault style={styles.albumType}>Artista</TextDefault>
                <TextDefault style={styles.albumTitle}>{data.name}</TextDefault>
                <TextDefault style={styles.albumArtist}>
                    {data.followers?.total.toLocaleString("pt-br")} seguidores
                </TextDefault> */}
                </Animated.View>
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
    artist: {
        width: "100%",
        height: "auto",
        aspectRatio: 1,
        minHeight: 200,
        minWidth: 200,
        marginBottom: 32,
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
        fontWeight: "800",
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
