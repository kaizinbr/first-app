import FeedCard from "@/components/home/feed-card";
import api, { apiAuth } from "@/lib/api";
import { Review } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { useRoute } from "expo-router";
import {
    StyleSheet,
    View,
    useWindowDimensions,
    Pressable,
    ScrollView,
} from "react-native";
import { AvatarNoPress } from "@/components/core/avatar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import Banner from "@/components/home/banner";
import TextDefault from "@/components/core/text-core";
import { Settings } from "@/lib/solar-icons/Outline";
import { Palette } from "@/lib/types";
import { selectRightColor } from "@/lib/util/selectRightColor";
import {
    lightenColor,
    darkenColor,
    getBannerColors,
} from "@/lib/util/workWithColors";
import { getColors } from "react-native-image-colors";

import { getPalette } from "expo-color-thief-native";
import { selectBackgroundColor } from "@/lib/util/selectRightColor";

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

import { Image } from "expo-image";

function UserCard({ data }: { data: any }) {
    const router = useRouter();

    return (
        <Pressable
            style={({ pressed }) => [
                {
                    width: 120,
                    borderRadius: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 16,
                    backgroundColor: pressed ? "#3d3d3d" : "#212223",
                },
            ]}
            onPress={() => {
                router.push({
                    pathname: "/(app)/(tabs)/(ahome)/user/[username]",
                    params: { username: data.username },
                });
            }}
        >
            <AvatarNoPress size={44} data={data} />
            <TextDefault
                style={{
                    color: "#eee",
                    fontSize: 14,
                    marginTop: 8,
                    fontWeight: "700",
                    textAlign: "center",
                }}
                numberOfLines={1}
            >
                {data.name}
            </TextDefault>
            <TextDefault
                style={{
                    color: "#aaa",
                    fontSize: 12,
                    marginTop: 4,
                    textAlign: "center",
                }}
                numberOfLines={1}
            >
                @{data.username}
            </TextDefault>

            <View
                style={[
                    {
                        alignItems: "center",
                        marginTop: 8,
                        justifyContent: "center",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 80,
                    },
                    data.isFollowing
                        ? {
                              backgroundColor: "#212223",
                              borderWidth: 1,
                              borderColor: "#8065ef",
                          }
                        : {
                              backgroundColor: "#8065ef",
                              borderWidth: 1,
                              borderColor: "#8065ef",
                          },
                ]}
            >
                <TextDefault
                    style={{
                        color: "#eee",
                        fontSize: 14,
                        fontWeight: "600",
                        textAlign: "center",
                    }}
                    numberOfLines={1}
                >
                    {data.isFollowing ? "Seguindo" : "Seguir"}
                </TextDefault>
            </View>
        </Pressable>
    );
}

export default function FindUsers() {
    const router = useRouter();

    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await apiAuth("/users");
                // console.log(response.profiles)
                setUsers(response.profiles);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        }
        fetchUsers();
    }, []);

    return (
        <View
            style={[
                {
                    width: "100%",
                    flex: 1,
                    // paddingHorizontal: 16,
                },
            ]}
        >
            <TextDefault
                style={{
                    color: "#eee",
                    fontSize: 16,
                    marginTop: 16,
                    fontWeight: "700",
                    paddingHorizontal: 16,
                }}
            >
                Encontre pessoas
            </TextDefault>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 16, flexDirection: "row" }}
                contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
            >
                {users.length > 0 &&
                    users.map((user) => <UserCard key={user.id} data={user} />)}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: "100%" },
    headerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 16,
        marginBottom: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        color: "#eeeeee",
        fontFamily: "Walsheim",
    },
    feed: { paddingBottom: 56 },
    h2: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "left",
        marginTop: 32,
        marginBottom: 16,
        color: "#eeeeee",
        paddingHorizontal: 16,
    },

    blob: {
        position: "absolute",
        borderRadius: 999,
        opacity: 0.6,
    },
    gradientContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0, // Fica atrás do ScrollView
        // justifyContent: "center",
        alignItems: "center",
    },
});
