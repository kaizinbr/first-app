import * as React from "react";
import { Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import Animated, {
    Extrapolation,
    SharedValue,
    interpolate,
    interpolateColor,
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useDerivedValue,
} from "react-native-reanimated";
import {
    TabBarProps,
    useCurrentTabScrollY,
    useHeaderMeasurements,
} from "react-native-collapsible-tab-view";
import type { ColorThiefColorData } from "expo-color-thief-native";

import { selectAlbumColor } from "@/lib/util/selectRightColor";


function ProfileTabChip({
    label,
    position,
    indexDecimal,
    progress,
    onPress,
    onLayoutChip,
    mainColor,
}: {
    label: string;
    position: number;
    indexDecimal: SharedValue<number>;
    progress: SharedValue<number>;
    onPress: () => void;
    onLayoutChip: (position: number, x: number, width: number) => void;
    mainColor: string;
}) {
    const backgroundStyle = useAnimatedStyle(() => {
        const focus = interpolate(
            Math.abs(indexDecimal.value - position),
            [0, 1],
            [1, 0],
            Extrapolation.CLAMP,
        );

        return {
            opacity: progress.value,
            backgroundColor: interpolateColor(
                focus,
                [0, 1],
                ["rgba(32,32,36,0.92)", mainColor],
            ),
        };
    });

    const textStyle = useAnimatedStyle(() => {
        const focus = interpolate(
            Math.abs(indexDecimal.value - position),
            [0, 1],
            [1, 0],
            Extrapolation.CLAMP,
        );

        return {
            color: interpolateColor(focus, [0, 1], ["#777", "#eee"]),
        };
    });

    return (
        <Pressable
            onPress={onPress}
            onLayout={(event) =>
                onLayoutChip(
                    position,
                    event.nativeEvent.layout.x,
                    event.nativeEvent.layout.width,
                )
            }
            style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                overflow: "hidden",
            }}
        >
            <Animated.View
                pointerEvents="none"
                style={[
                    {
                        position: "absolute",
                        inset: 0,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.08)",
                    },
                    backgroundStyle,
                ]}
            />
            <Animated.Text
                style={[
                    {
                        fontSize: 14,
                        fontWeight: "600",
                        fontFamily: "Walsheim",
                    },
                    textStyle,
                ]}
            >
                {label}
            </Animated.Text>
        </Pressable>
    );
}

export default function ProfileTabBar({
    tabNames,
    tabProps,
    indexDecimal,
    onTabPress,
    collapsedOffset,
    palette,
}: TabBarProps<string> & { collapsedOffset: number; palette: ColorThiefColorData[] }) {
    const { width: windowWidth } = useWindowDimensions();
    const scrollRef = React.useRef<React.ComponentRef<typeof ScrollView>>(null);
    const layouts = React.useRef<{ x: number; width: number }[]>([]);

    
        const mainColor = selectAlbumColor(palette).hex;

    const scrollY = useCurrentTabScrollY();
    const { height } = useHeaderMeasurements();

    const progress = useDerivedValue(() => {
        if (height === 0) return 0;

        const distance = height - collapsedOffset;

        return interpolate(
            scrollY.value,
            [distance - 60, distance],
            [0, 1],
            Extrapolation.CLAMP,
        );
    });

    const onLayoutChip = React.useCallback(
        (position: number, x: number, width: number) => {
            layouts.current[position] = { x, width };
        },
        [],
    );

    const scrollToChip = React.useCallback(
        (position: number) => {
            const layout = layouts.current[position];

            if (!layout) return;

            scrollRef.current?.scrollTo({
                x: Math.max(0, layout.x + 12 + layout.width / 2 - windowWidth / 2),
                animated: true,
            });
        },
        [windowWidth],
    );

    useAnimatedReaction(
        () => Math.round(indexDecimal.value),
        (current, previous) => {
            if (current !== previous) {
                runOnJS(scrollToChip)(current);
            }
        },
    );

    return (
        <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                paddingHorizontal: 12,
                paddingVertical: 8,
            }}
            style={{ backgroundColor: "transparent", zIndex: 10 }}
        >
            <View style={{ flexDirection: "row", gap: 8 }}>
                {tabNames.map((name, position) => {
                    const label = tabProps.get(name)?.label;

                    return (
                        <ProfileTabChip
                            key={name}
                            label={typeof label === "string" ? label : String(name)}
                            position={position}
                            indexDecimal={indexDecimal}
                            progress={progress}
                            onPress={() => onTabPress(name)}
                            onLayoutChip={onLayoutChip}
                            mainColor={mainColor}
                        />
                    );
                })}
            </View>
        </ScrollView>
    );
}