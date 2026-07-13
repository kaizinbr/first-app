import { BottomTabBar, type BottomTabBarProps } from "expo-router/js-tabs";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useTabBarTranslateY } from "@/lib/tab-bar-scroll";

export function AnimatedTabBar(props: BottomTabBarProps) {
  const translateY = useTabBarTranslateY();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ position: "absolute", left: 0, right: 0, bottom: 0 }, animatedStyle]}>
      <BottomTabBar {...props} />
    </Animated.View>
  );
}