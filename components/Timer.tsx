import { Sizes } from "@/constants/Sizes";
import { textDefault } from "@/constants/Styles";
import { useAvocadoro } from "@/store/AvocadoroContext";
import {
    requestNotifee,
    scheduleNotification,
} from "@/util/scheduleNotification";
import Ionicons from "@expo/vector-icons/Ionicons";
import notifee from "@notifee/react-native";
import { AudioSource, useAudioPlayer } from "expo-audio";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, StyleSheet, Text, Vibration, View } from "react-native";
import QuotePrinter from "./QuotePrinter";
import TimeDisplay from "./TimeDisplay";
import Button from "./UI/Button";

type TimerProps = {
    onComplete: (minutes: number, finishTime: number) => void;
    focusTimer: number;
    breakTimer: number;
    supabaseId?: string;
    supabaseFinishTime?: string;
    onTotalSecondsChange?: (seconds: number) => void;
    transferRecived?: boolean;
};

export default function Timer({
    onComplete,
    focusTimer,
    breakTimer,
    supabaseId,
    supabaseFinishTime,
    onTotalSecondsChange,
    transferRecived,
}: TimerProps) {
    const [totalSeconds, setTotalSeconds] = useState<number>(focusTimer * 60);

    const timerRef = useRef<number | null>(null);
    const endTimeRef = useRef<number | null>(null);

    const { timerOn, setTimerOn, setMessage, supabase, timerMode, setTimerMode } = useAvocadoro();

    // Import sounds
    const breakTimeSound: AudioSource = require("@/assets/sounds/breakTime.mp3");
    const focusTimeSound: AudioSource = require("@/assets/sounds/focusTime.mp3");

    const focusPlayer = useAudioPlayer(focusTimeSound);
    const breakPlayer = useAudioPlayer(breakTimeSound);

    // CHeck if app is active
    const [appIsActive, setAppIsActive] = useState(true);

    useEffect(() => {
        if (transferRecived) reset();
    }, [transferRecived]);

    useEffect(() => {
        // Check if app is active,
        const subscription = AppState.addEventListener(
            "change",
            (nextState) => {
                setAppIsActive(nextState === "active");
            },
        );

        // Request permision for notifications
        requestNotifee();

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        if (supabaseFinishTime && supabaseId) {
            const finishTime = new Date(supabaseFinishTime + "Z").getTime();
            const remaining = Math.ceil((finishTime - Date.now()) / 1000);

            if (remaining > 0) {
                if (timerRef.current !== null) return;
                setTotalSeconds(remaining);
                setTimerOn(true);
                endTimeRef.current = finishTime; // set AFTER start so it doesn't get overwritten
                timerRef.current = window.setInterval(() => {
                    if (endTimeRef.current === null) return;
                    const remaining = Math.ceil(
                        (endTimeRef.current - Date.now()) / 1000,
                    );
                    setTotalSeconds(Math.max(0, remaining));
                }, 1000);
            }
        }
    }, [supabaseFinishTime]);

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

        // Pass to parent component
        onTotalSecondsChange?.(totalSeconds);

        // Timer functions
        if (totalSeconds === 0 && appIsActive) {
            if (timerRef.current !== null) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            setTimeout(() => {
                if (timerMode === "break") {
                    // Set focus mode, reset the timer and play the sounds/vibrations
                    setTimerMode("focus");
                    setTotalSeconds(focusTimer * 60);
                    // Calculate end time when app is inactive
                    endTimeRef.current = Date.now() + focusTimer * 60 * 1000;
                    scheduleNotification(focusTimer * 60, "focus");
                    focusPlayer.seekTo(0);
                    focusPlayer.play();
                    Vibration.vibrate([0, 500, 500, 500, 500, 500, 500, 500]);
                } else {
                    // Set break mode, reset the timer and play the sounds/vibrations
                    if (endTimeRef.current !== null) {
                        onComplete(focusTimer, endTimeRef.current);
                    }
                    setTimerMode("break");
                    setTotalSeconds(breakTimer * 60);
                    // Calculate end time when app is inactive
                    endTimeRef.current = Date.now() + breakTimer * 60 * 1000;
                    scheduleNotification(breakTimer * 60, "break");
                    breakPlayer.seekTo(0);
                    breakPlayer.play();
                    Vibration.vibrate([250, 500, 1000, 500, 1000, 500]);
                }
            }, 1000);

            // Start the timer
            timerRef.current = window.setInterval(() => {
                if (endTimeRef.current === null) return;
                const remaining = Math.ceil(
                    (endTimeRef.current - Date.now()) / 1000,
                );
                setTotalSeconds(Math.max(0, remaining));
            }, 1000);
        }
    }, [totalSeconds, appIsActive]);

    // Start timer function
    const start = useCallback(async (): Promise<void> => {
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
    }, [totalSeconds, timerMode, timerOn]);

    // Stop/Pause timer
    const stop = useCallback(async (): Promise<void> => {
        setMessage("");
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        endTimeRef.current = null;
        deactivateKeepAwake();
        await notifee.cancelAllNotifications(); // clear any previous pending
    }, []);

    // Reset message to prevent accidental press
    const resetMessage = useCallback((): void => {
        setMessage("Hold for 1 second to reset");
        setTimeout(() => {
            setMessage("");
        }, 5000);
    }, []);

    // Reset the timer
    const reset = useCallback(async (): Promise<void> => {
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
    }, [focusTimer]);

    // Skip break function
    const skip = useCallback(async (): Promise<void> => {
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
    }, [timerOn, focusTimer]);

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
                <TimeDisplay totalSeconds={totalSeconds} />
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
                        accessibilityLabel="play-button"
                    />
                    <Button
                        title={
                            <Ionicons name="pause" size={Sizes.buttonIcon} />
                        }
                        icon={true}
                        onPress={() => stop()}
                        accessibilityLabel="stop-button"
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
                        accessibilityLabel="reset-button"
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
