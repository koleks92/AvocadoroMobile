import AnimatedRoot from "@/components/UI/AnimatedRoot";
import GoBackButton from "@/components/UI/GoBackButton";
import { rootStyles, textDefault } from "@/constants/Styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

type SessionGroupProps = {
    id: string
    name: string;
    focusTimer: string;
    breakTimer: string;
    totalMinutes: string;
}

export default function Group() {
    const router = useRouter();

    // Read the values from the route
    const { name, focusTimer, breakTimer, totalMinutes, id } =
        useLocalSearchParams<SessionGroupProps>();

    return (
        <>
            <AnimatedRoot />
            <View style={styles.root}>
                <GoBackButton
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
