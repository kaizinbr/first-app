import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { UserProfile } from "@/lib/types";
import api, { apiAuth } from "@/lib/api";

import { getColors } from "react-native-image-colors";
import { useState, useEffect, use } from "react";
import { Palette } from "@/lib/types";
import { VerifiedCheck } from "@solar-icons/react-native/Bold";
import { LinearGradient } from "expo-linear-gradient";

export function SkeletonProfileHeader() {
    // const "#8065ef" = colors ? selectRightColor(colors) : "#8065ef";

    return (
        <View
            style={{
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#161718",
                alignItems: "flex-start",
                justifyContent: "center",
                width: "100%",
                height: 400,
            }}
        >
            <LinearGradient
                colors={["#8065ef", "#161718"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <LinearGradient
                colors={["#8065ef", "#161718"]} // Troque pela cor dinâmica do álbum depois
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
            />
            <LinearGradient
                colors={["transparent", "rgba(22,23,24,1)"]}
                start={{ x: 0.5, y: 0.1 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <View
                style={{
                    padding: 16,
                    // paddingTop: 84,
                    paddingBottom: 32,
                    width: "100%",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "flex-start",
                        position: "relative",
                        flexDirection: "column",
                        marginBottom: 28,
                        paddingTop: 84,
                        height: "100%",
                    }}
                >
                    <View
                        style={{
                            width: 112,
                            height: 112,
                            borderRadius: 112 * 0.306,
                            backgroundColor: "#5b5b5b",
                            marginBottom: 28,
                        }}
                    />
                    <View
                        style={{
                            width: 112,
                            height: 20,
                            borderRadius: 112 * 0.306,
                            backgroundColor: "#5b5b5b",
                            marginBottom: 8,
                        }}
                    />
                    <View
                        style={{
                            width: 98,
                            height: 14,
                            borderRadius: 98 * 0.306,
                            backgroundColor: "#5b5b5b",
                        }}
                    />
                    <View
                        style={{ flexDirection: "row", gap: 16, marginTop: 12 }}
                    >
                        <View
                            style={{
                                width: 80,
                                height: 14,
                                borderRadius: 80 * 0.306,
                                backgroundColor: "#5b5b5b",
                            }}
                        />
                        <View
                            style={{
                                width: 80,
                                height: 14,
                                borderRadius: 80 * 0.306,
                                backgroundColor: "#5b5b5b",
                            }}
                        />
                        <View
                            style={{
                                width: 80,
                                height: 14,
                                borderRadius: 80 * 0.306,
                                backgroundColor: "#5b5b5b",
                            }}
                        />
                    </View>
                    <View
                        style={{
                            marginTop: 16,
                            paddingHorizontal: 44,
                            paddingVertical: 18,
                            borderRadius: 9999,
                            backgroundColor: "#5b5b5b",
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

export function SkeletonProfileBody() {
    // const "#8065ef" = colors ? selectRightColor(colors) : "#8065ef";

    return (
        <View
            style={{
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#161718",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                width: "100%",
                height: "100%",
            }}
        >
            <View style={{ flexDirection: "row", gap: 16 }}>
                <View
                    style={{
                        width: 74,
                        height: 16,
                        borderRadius: 74 * 0.306,
                        backgroundColor: "#5b5b5b",
                    }}
                />
                <View
                    style={{
                        width: 74,
                        height: 16,
                        borderRadius: 74 * 0.306,
                        backgroundColor: "#5b5b5b",
                    }}
                />
                <View
                    style={{
                        width: 74,
                        height: 16,
                        borderRadius: 74 * 0.306,
                        backgroundColor: "#5b5b5b",
                    }}
                />
                <View
                    style={{
                        width: 74,
                        height: 16,
                        borderRadius: 74 * 0.306,
                        backgroundColor: "#5b5b5b",
                    }}
                />
            </View>
            <View
                style={{
                    flexDirection: "row",
                    gap: 16,
                    marginTop: 24,
                    width: "100%",
                    paddingHorizontal: 16,
                }}
            >
                <View
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 32 * 0.306,
                        backgroundColor: "#5b5b5b",
                    }}
                />

                <View style={{ flexDirection: "column", gap: 12, flex: 1 }}>
                    <View
                        style={{
                            width: "100%",
                            height: 16,
                            borderRadius: 9999,
                            backgroundColor: "#5b5b5b",
                        }}
                    /><View
                        style={{
                            width: "100%",
                            height: 14,
                            borderRadius: 9999,
                            backgroundColor: "#5b5b5b",
                        }}
                    /><View
                        style={{
                            width: "100%",
                            height: 14,
                            borderRadius: 9999,
                            backgroundColor: "#5b5b5b",
                        }}
                    /><View
                        style={{
                            width: "100%",
                            height: 14,
                            borderRadius: 9999,
                            backgroundColor: "#5b5b5b",
                        }}
                    /><View
                        style={{
                            width: "100%",
                            height: 144,
                            borderRadius: 14,
                            backgroundColor: "#5b5b5b",
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

export function SkeletonProfile() {
    return (
        <View style={styles.container}>
            <SkeletonProfileHeader />
            <SkeletonProfileBody />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#161718",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
    },
    skeleton: {
        backgroundColor: "#ccc",
        borderRadius: 8,
    },
});
