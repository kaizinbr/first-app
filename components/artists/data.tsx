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

export default function ArtistData({
    data,
}: any) {
    return (
        <>
            <Animated.View
                style={[
                    styles.container,
                ]}
            >
                <TextDefault style={styles.artistsTag}>Artista</TextDefault>
                <TextDefault style={styles.artistTitle}>
                    {data.name}
                </TextDefault>
                <TextDefault style={styles.artistsSubtitle}>
                    {data.followers?.total.toLocaleString("pt-br")} seguidores
                </TextDefault>
            </Animated.View>

            {data.description && (
                <View style={{ padding: 16, gap: 16, zIndex: 10, }}>
                    <View style={styles.sec}>
                        <TextDefault style={styles.descriptionTitle}>
                            Biografia
                        </TextDefault>
                        <TextDefault style={styles.descriptionText}>
                            {data.description}
                        </TextDefault>
                    </View>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "transparent",
        zIndex: 10,
        marginTop: -16,
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
    artistsTag: {
        color: "#dbdbdb",
        fontSize: 12,
        fontWeight: "500",
    },
    artistTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "800",
        marginTop: 4,
    },
    artistsSubtitle: {
        color: "#dbdbdb",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 4,
    },
    descriptionTitle: {
        color: "#989898",
        fontSize: 12,
        fontWeight: "bold",
    },
    descriptionText: {
        color: "#eee",
        fontSize: 14,
    },
    sec: {
        backgroundColor: "#212223",
        padding: 16,
        borderRadius: 12,
        gap: 4,
    },
});
