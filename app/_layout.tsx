import { Colors } from "@/constants/Colors";
import { AvocadoroProvider } from "@/store/AvocadoroContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://4510923ab15a8db2a79d0455db1b2f9e@o4509752951963648.ingest.de.sentry.io/4511003180007504',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
    duration: 500,
    fade: true,
});

export default Sentry.wrap(function RootLayout() {
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
});
