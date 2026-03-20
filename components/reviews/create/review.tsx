// import { Host, Slider } from "@expo/ui/jetpack-compose";
import Slider from "@react-native-community/slider";
import React, { useRef, useState, useEffect, use } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
    Button,
    Pressable,
    Text,
    TextInput,
} from "react-native";
import { Album, Track, Review, Palette } from "@/lib/types";
import PostEditor from "@/components/reviews/rich-text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReviewStep({
    reviewData,
    total,
    colors,
    goBack,
    onSubmit,
    text,
    setText

}: {
    reviewData: {
        reviewed: boolean;
        rating: Review | null;
        album: Album;
    };
    total: number;
    colors: Palette;
    goBack: () => void;
    onSubmit: () => void;
    text: string;
    setText: (value: string) => void;
}) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View
                style={styles.header}
            >
                <Pressable onPress={goBack}>
                    <Text style={styles.textDefault}>Cancelar</Text>
                </Pressable>
                {/* <Text style={styles.textDefault}>{reviewData.album.name}</Text> */}

                <Pressable onPress={onSubmit}>
                    <Text style={styles.textDefault}>Publicar</Text>
                </Pressable>
            </View>
            {/* Rich text editor */}
            <View style={styles.editorContainer}>
                <PostEditor onChange={setText} reviewData={reviewData} total={total} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        minHeight: "100%",
        // backgroundColor: "#a23939", // Cor de fundo do editor
        borderRadius: 12,
        flexDirection: "column",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        width: "100%",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    editorContainer: {
        width: "100%",
        paddingVertical: 16,
        flex: 1,
    },
    textSec: {
        paddingVertical: 16,
        width: "100%",
        color: "#eee",
        borderRadius: 8,
    },

    textDefault: {
        color: "#eee",
        fontSize: 16,
        fontWeight: "800",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        color: "#eee",
    },
    image: {
        width: 150,
        height: 150,
        marginTop: 20,
        resizeMode: "contain",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        // gap: 8,
    },
    input: {
        fontSize: 24,
        color: "#eeeeee",
    },
    inputSide: {
        fontSize: 24,
        color: "#eeeeee",
    },
});
