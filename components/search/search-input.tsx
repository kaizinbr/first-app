import Input from "@/components/input";
import { StyleSheet, View, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import api from "@/lib/api";
import { useEffect, useState } from "react";

import { SearchResponse } from "@/lib/types";
import { MinimalisticMagnifier  } from '@solar-icons/react-native/Outline'

export default function SearchInput({
    results,
    setResults,
    type,
    setLoading,
}: {
    results: SearchResponse | null;
    setResults: (results: SearchResponse | null) => void;
    type: "tracks" | "artists" | "albums" | "users" | "reviews";
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
        api.get(`/search?q=${debounced}`)
            .then((response) => {
                // console.log("Resultados da pesquisa:", response.data);
                setResults(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erro na pesquisa:", error);
            });
    }, [debounced]);

    return (
        <View style={[styles.main, { paddingTop: insets.top + 16 }]}>
            <View style={styles.searchWrapper}>
                <MinimalisticMagnifier color="#9c9c9c" size={20} style={{ marginRight: 8 }} />
                <TextInput
                    placeholder="Pesquisar..."
                    value={searchQuery}
                    style={styles.searchInput}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#9c9c9c"
                    inlineImageLeft="search"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        // flex: 1,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },
    searchWrapper: {
        width: "100%",
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#262626",
        backgroundColor: "#1b1c1d",
        borderRadius: 12,
        color: "#eeeeee",
        flexDirection: "row",
        alignItems: "center",
        // overflow: "hidden",
    },
    searchInput: {
        width: "90%",
        // flex: 1,
        padding: 0,
        paddingVertical: 12,
        // backgroundColor: "red",
        color: "#eeeeee",
    },
});
