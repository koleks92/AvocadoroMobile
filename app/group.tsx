import AnimatedRoot from "@/components/UI/AnimatedRoot";
import Button from "@/components/UI/Button";
import { rootStyles, textDefault } from "@/constants/Styles";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Group() {
    const router = useRouter();

    return (
        <>
            <AnimatedRoot />
            <View style={styles.root}>
                <Button
                    title="Go back"
                    onPress={() => {
                        router.back();
                    }}
                />
                <Text style={styles.text}>Group.</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    root: rootStyles,
    text: {
        ...textDefault,
    },
});
