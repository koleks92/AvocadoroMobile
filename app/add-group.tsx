import AnimatedRoot from "@/components/UI/AnimatedRoot";
import GoBackButton from "@/components/UI/GoBackButton";
import { rootStyles, textDefault } from "@/constants/Styles";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function AddGroup() {
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
                <Text style={styles.text}>Add Group</Text>
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
