import { Colors } from "@/constants/Colors";
import { textDefault } from "@/constants/Styles";
import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function AddGroup() {
    const router = useRouter();

    return (
        <View style={styles.root}>
            <Button
                title="Go back"
                onPress={() => {
                    router.back();
                }}
            />
            <Text style={styles.text}>Add Group.</Text>
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
      ...textDefault
    },
});
