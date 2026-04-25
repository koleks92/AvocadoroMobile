import { Sizes } from "@/constants/Sizes";
import { textDefault } from "@/constants/Styles";
import { useTimer } from "@/hooks/useTimer";
import { useAvocadoro } from "@/store/AvocadoroContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
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
    // Context
    const { setMessage, timerMode } = useAvocadoro();

    // useTimer hook
    const { start, stop, reset, skip, totalSeconds } = useTimer({
        focusTimer,
        breakTimer,
        onComplete,
        supabaseId,
        supabaseFinishTime,
        onTotalSecondsChange,
    });

    // Reset timer if transfer recived
    useEffect(() => {
        if (transferRecived) reset();
    }, [transferRecived]);

    // Reset message to prevent accidental press
    const resetMessage = useCallback((): void => {
        setMessage("Hold for 1 second to reset");
        setTimeout(() => {
            setMessage("");
        }, 5000);
    }, []);

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
