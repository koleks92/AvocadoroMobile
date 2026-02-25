import { Colors } from "@/constants/Colors";
import { Sizes } from "@/constants/Sizes";
import { textDefault } from "@/constants/Styles";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface ButtonProps {
    title: string | ReactNode;
    onPress: () => void;
    onLongPress?: () => void;
    icon?: boolean;
    timer?: boolean;
    noSpace?: boolean;
    isSelected?: boolean;
    accessibilityLabel?: string;
    deleteButton?: boolean
}

export default function Button({
    title,
    onPress,
    onLongPress,
    icon,
    timer,
    noSpace,
    isSelected,
    accessibilityLabel,
    deleteButton
}: ButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            delayLongPress={800}
            style={({ pressed }) => [
                styles.root,
                pressed ? styles.pressed : null,
                icon ? styles.icon : null,
                timer ? styles.timer : null,
                isSelected ? styles.selected : null,
                deleteButton ? styles.delete : null,
                noSpace ? styles.noSpace : null
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
        justifyContent: "center",
        alignItems: "center",
        //      backgroundColor: Colors.primaryGreen,
        borderRadius: Sizes.buttonBorderRadius,
        padding: Sizes.buttonPadding,
        height: Sizes.buttonInputHeight,
        margin: Sizes.buttonMargin,
    },
    icon: {
        borderRadius: Sizes.smallButtonHeight / 2,
        width: Sizes.smallButtonHeight,
        height: Sizes.smallButtonHeight,
    },
    timer: {
        margin: 0,
    },
    noSpace: {
        height: "auto",
        margin: 0,
        padding: 0,
    },
    pressed: {
        backgroundColor: Colors.primaryDarkGreen,
        transform: [{ scale: 0.99 }],
    },
    selected: {
        backgroundColor: Colors.primaryDarkGreen,
    },
    title: {
        ...textDefault,
        fontSize: Sizes.buttonFont,
    },
    delete: {
        backgroundColor: Colors.red
    }
});
