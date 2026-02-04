import { Colors } from "@/constants/Colors";
import { Sizes } from "@/constants/Sizes";
import { textDefault } from "@/constants/Styles";
import { Pressable, StyleSheet, Text } from "react-native";
import { ReactNode } from 'react';

interface ButtonProps {
    title: string | ReactNode;
    onPress: () => void;
    icon?: boolean;
    accessibilityLabel?: string;
}

export default function Button({ title, onPress, icon, accessibilityLabel }: ButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.root,
                pressed ? styles.pressed : null,
                icon ? styles.icon : null
            ]}
            accessibilityLabel={accessibilityLabel}
        >
            <Text style={styles.title}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    root: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primaryGreen,
        borderRadius: Sizes.buttonBorderRadius,
        padding: Sizes.buttonPadding,
        height: Sizes.buttonInputHeight,
        margin: Sizes.buttonMargin,
    },
    icon: {
        borderRadius: Sizes.buttonInputHeight / 2,
        width: Sizes.buttonInputHeight
    },
    pressed: {
        backgroundColor: Colors.primaryDarkGreen,
        transform: [{ scale: 0.99 }],
    },
    title: {
        ...textDefault,
        fontSize: Sizes.buttonFont,
    },

});
