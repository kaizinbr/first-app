import { createContext, useContext, useRef } from "react";
import {
    useSharedValue,
    useAnimatedScrollHandler,
    withTiming,
    type SharedValue,
} from "react-native-reanimated";

const TAB_BAR_HEIGHT = 56;
const HIDE_THRESHOLD = 8; // px mínimos de delta pra evitar jitter em bounce/micro-scroll

type TabBarScrollContextType = {
    translateY: SharedValue<number>;
};

const TabBarScrollContext = createContext<TabBarScrollContextType | null>(null);

export function TabBarScrollProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const translateY = useSharedValue(0);
    return (
        <TabBarScrollContext.Provider value={{ translateY }}>
            {children}
        </TabBarScrollContext.Provider>
    );
}

function useTabBarScrollContext() {
    const ctx = useContext(TabBarScrollContext);
    if (!ctx)
        throw new Error(
            "useTabBarScroll deve estar dentro de TabBarScrollProvider",
        );
    return ctx;
}

export function useTabBarScrollHandler() {
    const { translateY } = useTabBarScrollContext();
    const lastY = useSharedValue(0);

    return useAnimatedScrollHandler({
        onScroll: (event) => {
            "worklet";
            const y = event.contentOffset.y;
            const delta = y - lastY.value;

            // ignora overscroll/bounce no topo (iOS) e valores negativos
            if (y <= 0) {
                translateY.value = withTiming(0, { duration: 200 });
                lastY.value = y;
                return;
            }

            if (Math.abs(delta) < HIDE_THRESHOLD) return;

            if (delta > 0) {
                // rolando pra baixo -> esconde
                translateY.value = withTiming(TAB_BAR_HEIGHT + 20, {
                    duration: 200,
                });
            } else {
                // rolando pra cima -> mostra
                translateY.value = withTiming(0, { duration: 200 });
            }
            lastY.value = y;
        },
    });
}

export function useTabBarTranslateY() {
    return useTabBarScrollContext().translateY;
}
