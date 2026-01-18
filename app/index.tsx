import Button from "@/components/UI/Button";
import { textDefault } from "@/constants/Styles";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
    const router = useRouter();

    const googleSignIn = async (): Promise<void> => {
        console.log("TODO");
    };

    const appleSignIn = async (): Promise<void> => {
        console.log("TODO");
    };

    return (
        <View style={styles.root}>
            <Text style={styles.text}>Login</Text>
            <View>
                <Button
                    title="Log In"
                    onPress={() => {
                        router.navigate("/dashboard");
                    }}
                />
            </View>
            <View style={styles.socialView}>
                <Button
                    title="Google"
                    onPress={() => googleSignIn()}
                />
                <Button
                    title="Apple"
                    onPress={() => appleSignIn()}
                />
            </View>
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
    socialView: {
      display: "flex",
      flexDirection: "row"
    }
});
