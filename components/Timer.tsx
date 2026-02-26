import { Sizes } from "@/constants/Sizes";
import { textDefault } from "@/constants/Styles";
import { useAvocadoro } from "@/store/AvocadoroContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AudioSource, useAudioPlayer } from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, Vibration, View } from "react-native";
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
    const [message, setMessage] = useState<string>("");
    const timerRef = useRef<number | null>(null);

    const { timerOn, setTimerOn } = useAvocadoro();

    // Calculate display values
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Import sounds
    const breakTimeSound: AudioSource = require("@/assets/sounds/breakTime.mp3");
    const focusTimeSound: AudioSource = require("@/assets/sounds/focusTime.mp3");

    const focusPlayer = useAudioPlayer(focusTimeSound);
    const breakPlayer = useAudioPlayer(breakTimeSound);

    useEffect(() => {
        // Timer
        if (timerRef.current === null) return;

        if (totalSeconds === 0) {
            if (timerMode === "break") {
                setTimerMode("focus");
                setTotalSeconds(focusTimer * 60);
                focusPlayer.seekTo(0);
                focusPlayer.play();
                Vibration.vibrate([0, 500, 500, 500, 500, 500, 500, 500]);
            } else {
                onComplete(focusTimer);
                setTimerMode("break");
                setTotalSeconds(breakTimer * 60);
                breakPlayer.seekTo(0);
                breakPlayer.play();
                Vibration.vibrate([250, 500, 1000, 500, 1000, 500]);
            }
        }
    }, [totalSeconds]);

    const start = (): void => {
        setMessage("");
        if (timerRef.current !== null) return; // prevent multiple intervals
        setTimerOn(true);
        timerRef.current = window.setInterval(() => {
            setTotalSeconds((prev) => prev - 1);
        }, 1000);
    };

    const stop = (): void => {
        setMessage("");
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const resetMessage = (): void => {
        setMessage("Hold for 1 second to reset");
        setTimeout(() => {
            setMessage("");
        }, 5000);
    };

    const reset = (): void => {
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
        }
        timerRef.current = null;
        setTotalSeconds(focusTimer * 60);
        setTimerOn(false);
        setTimerMode("focus");
        setMessage("");
    };

    const skip = (): void => {
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
            timerRef.current = window.setInterval(() => {
                setTotalSeconds((prev) => prev - 1);
            }, 1000);
        }
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
            <View style={styles.messageView}>
                <Text style={styles.messageText}>{message}</Text>
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
    messageView: { flex: 1 },
    messageText: {
        ...textDefault,
        fontSize: Sizes.messageText,
        textAlign: "center",
        marginTop: Sizes.messageMarginTop,
        marginHorizontal: Sizes.messageMargin,
        color: "red",
    },
});
