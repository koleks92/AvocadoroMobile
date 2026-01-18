import Button from "@/components/UI/Button";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { textDefault } from "@/constants/Styles";

export default function Index() {
    const router = useRouter();

    return (
        <View
            style={styles.root}
        >
            <Text style={styles.text}>Login</Text>
            <Button
                title="Dashboard"
                onPress={() => {
                    router.navigate("/dashboard");
                }}
            />
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
    }
});
