import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Dashboard() {
    const router = useRouter();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Button
                title="Log out"
                onPress={() => {
                    router.navigate("/");
                }}
            />
            <Text>Dashboard.</Text>
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
    );
}
