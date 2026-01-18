import { useRouter } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { textDefault } from "@/constants/Styles";
import Button from "@/components/UI/Button";

export default function Settings() {
    const router = useRouter();

    return (
        <View
            style={styles.root}
        >
            <Button
                title="Go back"
                onPress={() => {
                    router.back();
                }}
            />
            <Text style={styles.text}>Settings.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        ...textDefault,
    },
});
