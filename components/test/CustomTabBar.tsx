import React, { FC } from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { TAB_BAR_HEIGHT, TABS, TabType } from "./TabConfig";

const styles = StyleSheet.create({
    customTabBar: {
        flexDirection: "row",
        height: TAB_BAR_HEIGHT,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#ccc",
    },
    tab: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: "#000",
    },
    tabText: {
        fontSize: 14,
        color: "#666",
    },
    tabTextActive: {
        fontWeight: "600",
        color: "#000",
    },
});

type CustomTabBarProps = {
    selectedTab: TabType;
    onTabPress: (tab: TabType) => void;
    style?: StyleProp<ViewStyle>;
};

const CustomTabBar: FC<CustomTabBarProps> = ({ selectedTab, onTabPress, style }) => (
    <View style={[styles.customTabBar, style]}>
        {Object.values(TABS).map((tab) => {
            const isActive = selectedTab === tab;

            return (
                <TouchableOpacity
                    key={tab}
                    style={[styles.tab, isActive && styles.tabActive]}
                    onPress={() => onTabPress(tab)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                        {tab}
                    </Text>
                </TouchableOpacity>
            );
        })}
    </View>
);
export default CustomTabBar;