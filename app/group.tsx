import Button from "@/components/UI/Button";
import { textDefault } from "@/constants/Styles";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Group() {
    const router = useRouter();

    return (
        <View style={styles.root}>
            <Button
                title="Go back"
                onPress={() => {
                    router.back();
                }}
            />
            <Text style={styles.text}>Group.</Text>
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
