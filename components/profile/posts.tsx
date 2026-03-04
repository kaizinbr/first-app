import {
    View,
    Text,
    Image,
    Button,
    StyleSheet,
    ScrollView,
} from "react-native";
import { UserProfile, Review } from "@/lib/types";
import { useEffect, useState } from "react";
import api, { apiAuth } from "@/lib/api";
import { Tabs } from "react-native-collapsible-tab-view";

import FeedCard from "@/components/home/feed-card";

export default function PostsRoute({ data }: { data: UserProfile }) {
    const [userPosts, setUserPosts] = useState<{
        totalReviews: number;
        reviews: Review[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await api.get(
                    `/users/${data.username}/reviews`,
                );
                setUserPosts(response.data);
                // console.log("Feed data fetched successfully:", response.data);
                // console.log("total reviews:", UserPosts!.totalReviews);
            } catch (error) {
                console.error("Error fetching feed data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, []);

    const ItemSeparator = () => {
        return <View style={styles.separator} />;
    };

    // 2. Criamos a função que vai renderizar cada item da lista
    const renderItem = ({ item }: { item: Review }) => (
        <FeedCard review={item} />
    );

    return (
        <Tabs.FlatList
            data={userPosts?.reviews || []} // Passamos o array de dados aqui
            keyExtractor={(item) => item.id.toString()} // Como ele identifica cada item único
            renderItem={renderItem} // A função que desenha o card
            ItemSeparatorComponent={ItemSeparator} // O SEPARADOR ENTRA AQUI!
            contentContainerStyle={{
                paddingBottom: 80,
                flexGrow: 1,
                width: "100%",
                paddingTop: 324,
                minHeight: 1500,
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
