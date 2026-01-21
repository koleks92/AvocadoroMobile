import { Colors } from "@/constants/Colors";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";

export default function AnimatedRoot() {
    const opacityRef = useSharedValue(1);

    useFocusEffect(
        useCallback(() => {
            opacityRef.value = withSequence(
                withTiming(1, { duration: 500 }),
                withTiming(0, { duration: 500 }),
            );

            return () => {
                opacityRef.value = withTiming(1, { duration: 500 });
            };
        }, []),
    );

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacityRef.value,
    }));

    return (
        <Animated.View
            pointerEvents="none" // Forces the layer to be click-through
            style={[
                animatedStyle,
                styles.animatedRoot,
                StyleSheet.absoluteFill,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    animatedRoot: {
        backgroundColor: Colors.background1,
        zIndex: 1,
    },
});
