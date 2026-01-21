import { Colors } from "@/constants/Colors";
import { AvocadoroProvider } from "@/store/AvocadoroContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
        MontserratItalic: require("../assets/fonts/Montserrat-Italic.ttf"),
        MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
        MontserratSemiBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hide();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{ flex: 1, backgroundColor: Colors.background1 }}
            >
                <AvocadoroProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: {
                                backgroundColor: Colors.background1,
                            },
                            animation: "fade",
                        }}
                    />
                </AvocadoroProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
