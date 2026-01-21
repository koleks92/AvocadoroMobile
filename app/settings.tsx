import AnimatedRoot from "@/components/UI/AnimatedRoot";
import Button from "@/components/UI/Button";
import GoBackButton from "@/components/UI/GoBackButton";
import { rootStyles, textDefault } from "@/constants/Styles";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Settings() {
    const router = useRouter();

    return (
        <>
            <AnimatedRoot />
            <View style={styles.root}>
                <GoBackButton
                    onPress={() => {
                        router.back();
                    }}
                />
                <Text style={styles.text}>Settings.</Text>
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
