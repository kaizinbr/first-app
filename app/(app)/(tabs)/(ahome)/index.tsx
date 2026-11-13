import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedReaction,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { AltArrowUpIcon } from "@solar-icons/react-native/linear/alt-arrow-up";
import HomePage from "@/components/home/main";

export default function Index() {
    const insets = useSafeAreaInsets();
    const animatedRef = useAnimatedRef<Animated.FlatList<any>>();
    const scrollOffsetY = useSharedValue(0);
    const topButton = useSharedValue(0);

    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollOffsetY.value = event.contentOffset.y;
        },
    });

    useAnimatedReaction(
        () => scrollOffsetY.value > 400,
        (mostrar, anterior) => {
            if (mostrar !== anterior) {
                topButton.value = withSpring(mostrar ? 1 : 0, {
                    damping: 24,
                    stiffness: 180,
                });
            }
        },
    );

    const statusBarOpacityStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            scrollOffsetY.value,
            [100, 160],
            [0, 1],
            Extrapolation.CLAMP,
        ),
    }));

    const topButtonStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            topButton.value,
            [0, 0.6],
            [0, 1],
            Extrapolation.CLAMP,
        ),
        transform: [
            { translateY: interpolate(topButton.value, [0, 1], [80, 0]) },
            { scale: interpolate(topButton.value, [0, 1], [0.8, 1]) },
        ],
        pointerEvents: topButton.value > 0.5 ? "auto" : "none",
    }));

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.statusBarBg,
                    { height: insets.top + 24 },
                    statusBarOpacityStyle,
                ]}
                pointerEvents="none"
            >
                <LinearGradient
                    colors={["#161718", "transparent"]}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            <Animated.View
                style={[
                    {
                        position: "absolute",
                        bottom: 16,
                        right: "50%",
                        marginRight: -16,
                        zIndex: 30,
                    },
                    topButtonStyle,
                ]}
            >
                <Pressable
                    style={{
                        backgroundColor: "#1e1e1e",
                        padding: 8,
                        borderRadius: 9999,
                    }}
                    onPress={() => {
                        animatedRef.current?.scrollToOffset({
                            offset: 0,
                            animated: true,
                        });
                    }}
                >
                    <AltArrowUpIcon color={"#eeeeee"} size={14} />
                </Pressable>
            </Animated.View>

            <HomePage
                onScrollAnimado={handleScroll}
                scrollOffsetY={scrollOffsetY}
                animatedRef={animatedRef}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        alignItems: "center",
        width: "100%",
        backgroundColor: "transparent",
    },
    statusBarBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        zIndex: 10,
    },
});
