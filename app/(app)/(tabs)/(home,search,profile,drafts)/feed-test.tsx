import { FlatList, StyleProp, StyleSheet, useWindowDimensions, View, ViewProps, ViewStyle } from "react-native";
import CustomTabBar from "@/components/test/CustomTabBar";
import { TAB_BAR_HEIGHT, TABS } from "@/components/test/TabConfig";
import { useCallback, useMemo, useRef, useState } from "react";
import Header from "@/components/test/Header";
import OverviewTab from "@/components/test/tabs/OverviewTab";
import HistoryTab from "@/components/test/tabs/HistoryTab";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { HeaderConfig } from "@/lib/types";
import useScrollSync from "@/lib/useScrollSync";
import { ScrollPair } from "@/lib/types";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContent: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'white',
    },
    tabContentAbsolute: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    tabContentHidden: {
        opacity: 0,
    },
});

const Home = () => {
    const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);
    const { bottom } = useSafeAreaInsets();
    const { height: screenHeight } = useWindowDimensions();

    const overviewRef = useRef<FlatList>(null);
    const historyRef = useRef<FlatList>(null);

    const [headerHeight, setHeaderHeight] = useState(0);
    const handleHeaderLayout = useCallback<NonNullable<ViewProps["onLayout"]>>(
        (event) => setHeaderHeight(event.nativeEvent.layout.height),
        []
    );

    const headerConfig = useMemo<HeaderConfig>(
        () => ({
            heightCollapsed: TAB_BAR_HEIGHT,
            heightExpanded: headerHeight,
        }),
        [headerHeight]
    );

    const { heightCollapsed, heightExpanded } = headerConfig;
    const headerDiff = heightExpanded - heightCollapsed;
    const rendered = headerHeight > 0;


    const overviewScrollValue = useSharedValue(0);
    const overviewScrollHandler = useAnimatedScrollHandler(
        (event) => (overviewScrollValue.value = event.contentOffset.y)
    );

    const historyScrollValue = useSharedValue(0);
    const historyScrollHandler = useAnimatedScrollHandler(
        (event) => (historyScrollValue.value = event.contentOffset.y)
    );


    const currentScrollValue = useDerivedValue(() =>
        activeTab === TABS.OVERVIEW ? overviewScrollValue.value : historyScrollValue.value
    );

    const translateY = useDerivedValue(() =>
        -Math.min(currentScrollValue.value, headerDiff)
    );

    const headerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const headerContainerStyle = useMemo<StyleProp<ViewStyle>>(
        () => [
            rendered ? styles.header : undefined,
            headerAnimatedStyle,
        ],
        [rendered, headerAnimatedStyle]
    );

    const contentContainerStyle = useMemo<StyleProp<ViewStyle>>(
        () => ({
            paddingTop: rendered ? headerHeight : 0,
            paddingBottom: bottom,
            minHeight: screenHeight + headerDiff,
        }),
        [headerHeight, screenHeight, headerDiff, bottom, rendered]
    );

    const scrollPairs = useMemo<ScrollPair[]>(
        () => [
            { list: overviewRef, position: overviewScrollValue },
            { list: historyRef, position: historyScrollValue },
        ],
        [overviewScrollValue, historyScrollValue]
    );

    const { sync } = useScrollSync(scrollPairs, headerConfig);


    const sharedProps = useMemo(
        () => ({
            contentContainerStyle,
            onMomentumScrollEnd: sync,
            onScrollEndDrag: sync,
            scrollEventThrottle: 16,
            scrollIndicatorInsets: { top: heightExpanded },
        }),
        [contentContainerStyle, sync, heightExpanded]
    );

    return (
        <View style={styles.container}>
            <Animated.View onLayout={handleHeaderLayout} style={headerContainerStyle}>
                <Header
                    name="Anshul Thakur"
                    mob="+91 98765-43210"
                    photo="https://picsum.photos/id/4/300/300"
                />
                <CustomTabBar selectedTab={activeTab} onTabPress={setActiveTab} />
            </Animated.View>
            <View style={styles.tabContent}>
                <View
                    style={[
                        styles.tabContent,
                        styles.tabContentAbsolute,
                        activeTab !== TABS.OVERVIEW && styles.tabContentHidden,
                    ]}
                    pointerEvents={activeTab === TABS.OVERVIEW ? "auto" : "none"}
                >
                    <OverviewTab
                        ref={overviewRef}
                        onScroll={overviewScrollHandler}
                        {...sharedProps}
                    />
                </View>

                <View
                    style={[
                        styles.tabContent,
                        styles.tabContentAbsolute,
                        activeTab !== TABS.HISTORY && styles.tabContentHidden,
                    ]}
                    pointerEvents={activeTab === TABS.HISTORY ? "auto" : "none"}
                >
                    <HistoryTab
                        ref={historyRef}
                        onScroll={historyScrollHandler}
                        {...sharedProps}
                    />
                </View>

            </View>

        </View>
    )
}
export default Home;