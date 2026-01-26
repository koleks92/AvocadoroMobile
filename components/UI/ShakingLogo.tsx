import { Sizes } from "@/constants/Sizes";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";

export default function ShakingLogo() {
    const translateX = useSharedValue(0);

    const handlePress = () => {
        const duration = 100;

        // Create a sequence: Center -> Right -> Left -> Right -> Left -> Back to Center
        translateX.value = withSequence(
            withTiming(0, { duration }),
            withTiming(-6, { duration }),
            withTiming(6, { duration }),
            withTiming(-4, { duration }),
            withTiming(4, { duration }),
            withTiming(0, { duration }),
        );
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <Pressable onPress={handlePress} accessibilityLabel="shaking-logo">
            <Animated.Image
                source={require("@/assets/images/logo.png")}
                style={[styles.logo, animatedStyle]}
                resizeMode="contain"
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    logo: {
        height: "100%",
        width: "100%",
        alignSelf: "center",
    },
});
