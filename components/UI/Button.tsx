import { Colors } from "@/constants/Colors";
import { Sizes } from "@/constants/Sizes";
import { textDefault } from "@/constants/Styles";
import { Pressable, StyleSheet, Text } from "react-native";

interface ButtonProps {
    title: string;
    onPress: () => void;
}

export default function Button({ title, onPress }: ButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.root,
                pressed ? styles.pressed : null,
            ]}
        >
            <Text style={styles.title}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    root: {
        display: "flex",
        backgroundColor: Colors.primaryGreen,
        borderRadius: Sizes.buttonBorderRadius,
        padding: Sizes.buttonPadding,
        margin: Sizes.buttonMargin,
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
