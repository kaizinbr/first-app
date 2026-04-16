import Input from "@/components/input";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import api from "@/lib/api";
import { useEffect, useState } from "react";

import { SearchResponse } from "@/lib/types";

export default function SearchAlbunsInput({
    results,
    setResults,
    type,
    setLoading,
}: {
    results: SearchResponse | null;
    setResults: (results: SearchResponse | null) => void;
    type: "albuns" | "artists" | "tracks";
    setLoading: (loading: boolean) => void;
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [debounced, setDebounced] = useState("");
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounced(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (debounced.length === 0) return;

        console.log("Pesquisar por:", debounced);

        setLoading(true);
        api.get(`/search/${type}?q=${debounced}`)
            .then((response) => {
                console.log("Resultados da pesquisa:", response.data);
                setResults(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erro na pesquisa:", error);
            });
    }, [debounced]);

    return (
        <View style={[styles.main]}>
            <Input
                placeholder="Pesquisar..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9c9c9c"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        // flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },
    searchInput: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#262626",
        backgroundColor: "#262626",
        borderRadius: 8,
        color: "#eeeeee",
    },
});
