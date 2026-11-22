import api from "@/lib/api";
import { UserProfile } from "@/lib/types";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";

import { ItemSeparator } from "@/components/core/separator";
import UserCards from "@/components/core/user-cards";

import { useUserFollowers } from "@/lib/queries/user";

export default function FollowingRoute({ data }: { data: UserProfile }) {
    const { data: userFollowersData, isLoading } = useUserFollowers(
        data.username,
    );

    return (
        <Tabs.FlatList
            data={userFollowersData?.followers || []} // Passamos o array de dados aqui
            keyExtractor={(item: {
                id: string;
                username: string;
                name: string;
                avatar_url: string;
            }) => item.id.toString()} // Como ele identifica cada item único
            renderItem={({ item }) => <UserCards data={item} />} // A função que desenha o card
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
                        Parece que {data.name || data.username} não tem
                        seguidores ainda...
                    </Text>
                )
            }
            contentContainerStyle={{
                width: "100%",
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
