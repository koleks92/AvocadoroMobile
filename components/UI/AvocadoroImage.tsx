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
    // 1. Create a "Shared Value" to hold the X position
    const translateX = useSharedValue(0);

    // 2. Define the animation logic
    const handlePress = () => {
        const duration = 100; // Speed of each shake

        // Create a sequence: Right -> Left -> Right -> Left -> Back to Center
        translateX.value = withSequence(
            withTiming(0, { duration }),
            withTiming(-6, { duration }),
            withTiming(6, { duration }),
            withTiming(-4, { duration }),
            withTiming(4, { duration }),
            withTiming(0, { duration }),
        );
    };

    // 3. Link the value to the style
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <Pressable onPress={handlePress}>
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
        height: Sizes.loginLogo,
        width: Sizes.loginLogo,
        alignSelf: "center",
    },
});
