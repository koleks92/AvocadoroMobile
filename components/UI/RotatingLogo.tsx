import React, { memo } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";

export default memo(function RotatingLogo() {
    const rotate = useSharedValue(0);

    // Animation of press
    const handlePress = () => {
        const duration = 100; // Total animation ~500ms (10 steps × 50ms)

        rotate.value = withSequence(
            withTiming(0, { duration }), // 0%
            withTiming(2, { duration }), // 10%
            withTiming(-2, { duration }), // 20%
            withTiming(4, { duration }), // 30%
            withTiming(-4, { duration }), // 40%
            withTiming(6, { duration }), // 50% - peak wobble
            withTiming(-4, { duration }), // 60%
            withTiming(4, { duration }), // 70%
            withTiming(-2, { duration }), // 80%
            withTiming(2, { duration }), // 90%
            withTiming(0, { duration }), // 100%
        );
    };

    // Animated styles
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotate.value}deg` }],
    }));

    return (
        <Pressable onPress={handlePress} accessibilityLabel="shaking-logo">
            <Animated.Image
                source={require("@/assets/images/logo_nospace.png")}
                style={[styles.logo, animatedStyle]}
                resizeMode="contain"
                accessibilityLabel="avocadoro-print"
            />
        </Pressable>
    );
});

const styles = StyleSheet.create({
    logo: {
        height: "100%",
        width: "100%",
        alignSelf: "center",
    },
});
