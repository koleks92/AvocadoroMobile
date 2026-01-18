import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Group() {
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
                title="Go back"
                onPress={() => {
                    router.back();
                }}
            />
            <Text>Group.</Text>
        </View>
    );
}
