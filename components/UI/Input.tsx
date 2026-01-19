import { Colors } from "@/constants/Colors";
import { Sizes } from "@/constants/Sizes";
import { textDefault } from "@/constants/Styles";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

interface InputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
}

export default function InputField({
    placeholder,
    value,
    onChangeText
}: InputProps) {
    const [isFocused, setIsFocused] = useState<boolean>(false);

    return (
        <TextInput
            style={[styles.root, isFocused ? styles.focus : null]}
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        />
    );
}

const styles = StyleSheet.create({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...textDefault,
        fontSize: Sizes.inputFont,
        padding: Sizes.inputPadding,
        margin: Sizes.inputMargin,
        backgroundColor: Colors.primaryGreen,
        borderRadius: Sizes.inputBorderRadius,
        width: Sizes.inputWidth,
    },
    focus: {
        backgroundColor: Colors.primaryDarkGreen,
    },
});
