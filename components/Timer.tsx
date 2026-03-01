import { Sizes } from "@/constants/Sizes";
import { textDefault } from "@/constants/Styles";
import { useAvocadoro } from "@/store/AvocadoroContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import notifee, { TriggerType } from "@notifee/react-native";
import { AudioSource, useAudioPlayer } from "expo-audio";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useEffect, useRef, useState } from "react";
import { AppState, StyleSheet, Text, Vibration, View } from "react-native";
import QuotePrinter from "./QuotePrinter";
import Button from "./UI/Button";

type timerModeType = "focus" | "break";

type TimerProps = {
    onComplete: (minutes: number) => void;
    focusTimer: number;
    breakTimer: number;
};

export default function Timer({
    onComplete,
    focusTimer,
    breakTimer,
}: TimerProps) {
    const [timerMode, setTimerMode] = useState<timerModeType>("focus");
    const [totalSeconds, setTotalSeconds] = useState<number>(focusTimer * 60);

    const timerRef = useRef<number | null>(null);
    const endTimeRef = useRef<number | null>(null);

    const { timerOn, setTimerOn, setMessage } = useAvocadoro();

    // Calculate display values
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Import sounds
    const breakTimeSound: AudioSource = require("@/assets/sounds/breakTime.mp3");
    const focusTimeSound: AudioSource = require("@/assets/sounds/focusTime.mp3");

    const focusPlayer = useAudioPlayer(focusTimeSound);
    const breakPlayer = useAudioPlayer(breakTimeSound);

    // CHeck if app is active
    const [appIsActive, setAppIsActive] = useState(true);

    // Notifee configuration and event listener for appIsActive
    useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            (nextState) => {
                setAppIsActive(nextState === "active");
            },
        );
        const requestNotifee = async () => {
            await notifee.createChannel({
                id: "avocadoro",
                name: "Avocadoro Timer",
            });
            await notifee.requestPermission();
        };

        requestNotifee();
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        // If timer is off
        if (timerRef.current === null) return;

        // Cancel notification if app is active
        const cancelNotification = async () => {
            await notifee.cancelAllNotifications();
        };

        if (totalSeconds === 3 && appIsActive) {
            cancelNotification();
        }

        // Timer functions
        if (totalSeconds === 0 && appIsActive) {
            if (timerMode === "break") {
                setTimerMode("focus");
                setTotalSeconds(focusTimer * 60);
                // Calculate end time when app is inactive
                endTimeRef.current = Date.now() + focusTimer * 60 * 1000;
                scheduleNotification(focusTimer * 60, "focus");
                focusPlayer.seekTo(0);
                focusPlayer.play();
                Vibration.vibrate([0, 500, 500, 500, 500, 500, 500, 500]);
            } else {
                onComplete(focusTimer);
                setTimerMode("break");
                setTotalSeconds(breakTimer * 60);
                // Calculate end time when app is inactive
                endTimeRef.current = Date.now() + breakTimer * 60 * 1000;
                scheduleNotification(breakTimer * 60, "break");
                breakPlayer.seekTo(0);
                breakPlayer.play();
                Vibration.vibrate([250, 500, 1000, 500, 1000, 500]);
            }
        }
    }, [totalSeconds, appIsActive]);

    // Start timer function
    const start = async (): Promise<void> => {
        setMessage("");
        if (timerRef.current !== null) return; // prevent multiple intervals
        setTimerOn(true);
        scheduleNotification(totalSeconds, timerMode);
        endTimeRef.current = Date.now() + totalSeconds * 1000;
        timerRef.current = window.setInterval(() => {
            if (endTimeRef.current === null) return;
            const remaining = Math.ceil(
                (endTimeRef.current - Date.now()) / 1000,
            );
            setTotalSeconds(Math.max(0, remaining));
        }, 1000);
        activateKeepAwakeAsync();
    };

    // Stop/Pause timer
    const stop = async (): Promise<void> => {
        setMessage("");
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        endTimeRef.current = null;
        deactivateKeepAwake();
        await notifee.cancelAllNotifications(); // clear any previous pending
    };

    // Reset message to prevent accidental press
    const resetMessage = (): void => {
        setMessage("Hold for 1 second to reset");
        setTimeout(() => {
            setMessage("");
        }, 5000);
    };

    // Reset the timer
    const reset = async (): Promise<void> => {
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
        }
        timerRef.current = null;
        setTotalSeconds(focusTimer * 60);
        endTimeRef.current = null;
        setTimerOn(false);
        setTimerMode("focus");
        setMessage("");
        deactivateKeepAwake();
        await notifee.cancelAllNotifications();
    };

    // Skip break function
    const skip = async (): Promise<void> => {
        // Clear existing interval if running
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Reset to focus mode
        setTimerMode("focus");
        setTotalSeconds(focusTimer * 60);
        setMessage("");

        // Restart timer if it was running
        if (timerOn) {
            endTimeRef.current = Date.now() + focusTimer * 60 * 1000;
            timerRef.current = window.setInterval(() => {
                if (endTimeRef.current === null) return;
                const remaining = Math.ceil(
                    (endTimeRef.current - Date.now()) / 1000,
                );
                setTotalSeconds(Math.max(0, remaining));
            }, 1000);
            scheduleNotification(focusTimer * 60, "focus");
        } else {
            await notifee.cancelAllNotifications();
        }
    };

    // Schedule notification when app is not active
    const scheduleNotification = async (
        seconds: number,
        mode: "focus" | "break",
    ) => {
        await notifee.cancelAllNotifications(); // clear any previous pending

        await notifee.createTriggerNotification(
            {
                title:
                    mode === "focus"
                        ? "✅ Focus session done!"
                        : "☕ Break over!",
                body:
                    mode === "focus"
                        ? "Click to start the break mode!"
                        : "Click to start the focus mode!",
                android: {
                    channelId: "avocadoro",
                    pressAction: { id: "default" },
                },
                ios: {
                    sound: "default",
                },
            },
            {
                type: TriggerType.TIMESTAMP,
                timestamp: Date.now() + seconds * 1000,
            },
        );
    };

    return (
        <View style={styles.root}>
            <View style={styles.titleView}>
                <Text style={styles.titleText}>
                    {timerMode === "break" ? "Break" : "Focus"}
                </Text>
                <View
                    style={{
                        opacity: timerMode === "break" ? 1 : 0,
                        pointerEvents: timerMode === "break" ? "auto" : "none",
                    }}
                >
                    <Button
                        title="Skip"
                        noSpace={true}
                        onPress={() => skip()}
                    />
                </View>
            </View>
            <View style={styles.timeView}>
                <Text style={styles.timeText}>
                    {String(minutes).padStart(2, "0")[0]}
                    {String(minutes).padStart(2, "0")[1]}:
                    {String(seconds).padStart(2, "0")[0]}
                    {String(seconds).padStart(2, "0")[1]}
                </Text>
            </View>
            <View style={styles.quoteView}>
                <QuotePrinter />
            </View>
            <View style={styles.timerButtonsView}>
                <View style={styles.topButtonsView}>
                    <Button
                        title={<Ionicons name="play" size={Sizes.buttonIcon} />}
                        icon={true}
                        onPress={() => start()}
                    />
                    <Button
                        title={
                            <Ionicons name="pause" size={Sizes.buttonIcon} />
                        }
                        icon={true}
                        onPress={() => stop()}
                    />
                </View>
                <View style={styles.bottomButtonsView}>
                    <Button
                        title={
                            <Ionicons name="refresh" size={Sizes.buttonIcon} />
                        }
                        icon={true}
                        onPress={() => resetMessage()}
                        onLongPress={() => reset()}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: "center",
    },
    titleView: {
        flex: 2,
        alignItems: "center",
    },
    titleText: {
        ...textDefault,
        fontSize: Sizes.timerTitleText,
    },
    timeView: {
        flex: 2,
        justifyContent: "center",
    },
    timeText: {
        ...textDefault,
        fontSize: Sizes.timerTimeText,
        fontVariant: ["tabular-nums"],
    },
    quoteView: { flex: 2, justifyContent: "center" },
    timerButtonsView: {
        flex: 2,
        justifyContent: "center",
    },
    topButtonsView: {
        display: "flex",
        flexDirection: "row",
    },
    bottomButtonsView: {
        alignItems: "center",
    },
});
