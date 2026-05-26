import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Pressable } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

const scale = useSharedValue(1)

const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
}))

export const FixedBtn = () => {
    return (
        <Pressable  onPressIn={() => (scale.value = withSpring(0.95))} onPressOut={() => (scale.value = withSpring(1))}>
            <Animated.View
                style={[
                    {
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: 'blue',
                        justifyContent: 'center',
                        alignItems: 'center',   
                    },
                    animatedStyle,
                ]}
            >
                {/* You can put an icon or text here */}
            </Animated.View>
        </Pressable>
    )
}