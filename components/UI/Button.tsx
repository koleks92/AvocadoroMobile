import { Pressable, StyleSheet, Text } from "react-native";

interface ButtonProps {
    title: string;
    onPress: () => void;
}

export default function Button({ title, onPress}: ButtonProps) {
    return (
        <Pressable
        onPress={onPress}
        style={({ pressed }) => [
            styles.root, pressed ? styles.pressed : null
        ]}
        >
            <Text style={styles.title}>{title}</Text>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    root: {

    },
    pressed: {

    },
    title: {

    }
})