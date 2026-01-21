import AnimatedRoot from "@/components/UI/AnimatedRoot";
import Button from "@/components/UI/Button";
import { rootStyles, textDefault } from "@/constants/Styles";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Dashboard() {
    const router = useRouter();

    return (
        <>
            <AnimatedRoot />
            <View style={styles.root}>
                <Button
                    title="Log out"
                    onPress={() => {
                        router.navigate("/");
                    }}
                />
                <Text style={styles.text}>Dashboard.</Text>
                <Button
                    title="Add Group"
                    onPress={() => {
                        router.navigate("/add-group");
                    }}
                />
                <Button
                    title="Group"
                    onPress={() => {
                        router.navigate("/group");
                    }}
                />
                <Button
                    title="Settings"
                    onPress={() => {
                        router.navigate("/settings");
                    }}
                />
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
