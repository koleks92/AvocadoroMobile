import AnimatedRoot from "@/components/UI/AnimatedRoot";
import Button from "@/components/UI/Button";
import { Sizes } from "@/constants/Sizes";
import { rootStyles, textDefault } from "@/constants/Styles";
import { useAvocadoro } from "@/store/AvocadoroContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Dashboard() {
    const router = useRouter();

    const { supabase, session } = useAvocadoro();

    useEffect(() => {
        if (!session) {
            router.navigate("/");
        }
    }, [session]);

    async function signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
    }

    return (
        <>
            <AnimatedRoot />
            <View style={styles.root}>
                <Button
                    title={
                        <MaterialIcons name="logout" size={Sizes.buttonIcon} />
                    }
                    onPress={() => {
                        signOut();
                    }}
                    accessibilityLabel="logout-button"
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
