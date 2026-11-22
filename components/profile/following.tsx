import api from "@/lib/api";
import { UserProfile } from "@/lib/types";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";

import { ItemSeparator } from "@/components/core/separator";
import UserCards from "@/components/core/user-cards";

import { useUserFollowings } from "@/lib/queries/user";

export default function FollowingRoute({ data }: { data: UserProfile }) {
    const { data: userFollowingsData, isLoading } = useUserFollowings(
        data.username,
    );

    return (
        <Tabs.FlatList
            data={userFollowingsData?.followings || []}
            keyExtractor={(item: {
                id: string;
                username: string;
                name: string;
                avatar_url: string;
            }) => item.id.toString()}
            renderItem={({ item }) => <UserCards data={item} />}
            ItemSeparatorComponent={ItemSeparator}
            ListEmptyComponent={
                isLoading ? (
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
                // flexGrow: 1,
                width: "100%",
                // paddingTop: 474,
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
