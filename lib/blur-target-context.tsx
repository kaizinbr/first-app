import { createContext, useContext, useRef, type PropsWithChildren, type RefObject } from "react";
import type { View } from "react-native";
import { BlurTargetView } from "expo-blur";

const BlurTargetContext = createContext<RefObject<View | null> | null>(null);

export function BlurTargetProvider({ children }: PropsWithChildren) {
    const targetRef = useRef<View | null>(null);

    return (
        <BlurTargetContext.Provider value={targetRef}>
            <BlurTargetView ref={targetRef} style={{ flex: 1 }}>
                {children}
            </BlurTargetView>
        </BlurTargetContext.Provider>
    );
}

export function useBlurTarget() {
    return useContext(BlurTargetContext);
}