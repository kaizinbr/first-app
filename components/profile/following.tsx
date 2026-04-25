import {
    View,
    Text,
    Image,
    Button,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { UserProfile, Review } from "@/lib/types";
import { useEffect, useState } from "react";
import api, { apiAuth } from "@/lib/api";
import { Tabs } from "react-native-collapsible-tab-view";

import UserCards from "@/components/core/user-cards";
import { ItemSeparator } from "@/components/core/separator";

export default function FollowingRoute({ data }: { data: UserProfile }) {
    const [userFollowings, setUserFollowings] = useState<{
        followings: {
            id: string;
            username: string;
            name: string;
            avatar_url: string;
        }[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserFollowings = async () => {
            try {
                const response = await api.get(
                    `/users/${data.username}/followings`,
                );
                setUserFollowings(response.data);
                // console.log("Feed data fetched successfully:", response.data);
                // console.log("total reviews:", UserPosts!.totalReviews);
            } catch (error) {
                console.error("Error fetching feed data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserFollowings();
    }, [data]);

    return (
        <Tabs.FlatList
            data={userFollowings?.followings || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <UserCards data={item} />}
            ItemSeparatorComponent={ItemSeparator}
            ListEmptyComponent={
                loading ? (
                    <ActivityIndicator
                        size="large"
                        color="#8065ef"
                        style={{ marginTop: 40 }}
                    />
                ) : (
                    <Text
                        style={{
                            color: "#eee",
                            textAlign: "center",
                            marginTop: 40,
                        }}
                    >
                        Parece que {data.name || data.username} não segue
                        ninguém ainda.
                    </Text>
                )
            }
            contentContainerStyle={{
                flexGrow: 1,
                width: "100%",
                paddingTop: 432,
                paddingBottom: 80,
            }}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,

        gap: 16,
        width: "100%",
    },

    separator: {
        height: 1,
        backgroundColor: "#333", // Uma cor cinza escura sutil que combina com seu modo dark
        marginVertical: 4, // O espaço entre o separador e os posts
    },
    textDefault: {
        color: "#eee", // A cor clara para o seu modo escuro
        fontSize: 16,
    },
});
