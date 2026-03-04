import AvocadoroPrint from "@/components/AvocadoroPrint";
import Timer from "@/components/Timer";
import AnimatedRoot from "@/components/UI/AnimatedRoot";
import Button from "@/components/UI/Button";
import GoBackButton from "@/components/UI/GoBackButton";
import { Colors } from "@/constants/Colors";
import { Sizes } from "@/constants/Sizes";
import { rootStyles, textDefault } from "@/constants/Styles";
import { useAvocadoro } from "@/store/AvocadoroContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";

type SessionGroupProps = {
    id: string;
    name: string;
    focusTimer: string;
    breakTimer: string;
    totalMinutes: string;
};

export default function Group() {
    const router = useRouter();

    const { supabase, timerOn, message, setMessage } = useAvocadoro();

    // Messages
    const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Read the values from the route
    const params = useLocalSearchParams<SessionGroupProps>();

    const [name, setName] = useState<string>(params.name || "Untitled");
    const [focusTimer, setFocusTimer] = useState<number>(
        Number(params.focusTimer) || 25,
    );
    const [breakTimer, setBreakTimer] = useState<number>(
        Number(params.breakTimer) || 5,
    );
    const [totalMinutes, setTotalMinutes] = useState<number>(
        Number(params.totalMinutes) || 0,
    );
    const [id, setId] = useState<string>(params.id || "");
    const [avocadoroAmount, setAvocadoroAmount] = useState<number>(0);

    const [totalTime, setTotalTime] = useState<string>("");

    function convertTime(): void {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        // Pad with leading zeros if needed
        const paddedHours = String(hours).padStart(2, "0");
        const paddedMinutes = String(minutes).padStart(2, "0");

        setTotalTime(`${paddedHours}h ${paddedMinutes}m`);
    }

    // Cleanup message timer
    useEffect(() => {
        return () => {
            if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        };
    }, []);

    useEffect(() => {
        setAvocadoroAmount(Math.floor(totalMinutes / focusTimer));
        convertTime();
    }, [totalMinutes]);

    // Shared values
    const timerHeight = useSharedValue(100);
    const timerOpacity = useSharedValue(100);
    const avocadoroHeight = useSharedValue(0);
    const avocadoroOpacity = useSharedValue(0);

    // Animated styles
    const timerAnimatedStyle = useAnimatedStyle(() => ({
        height: `${timerHeight.value}%`,
        opacity: timerOpacity.value,
    }));

    const avocadoroAnimatedStyle = useAnimatedStyle(() => ({
        height: `${avocadoroHeight.value}%`,
        opacity: avocadoroOpacity.value,
    }));

    const timing = { duration: 500, easing: Easing.inOut(Easing.ease) };

    const closeTimerOpenAvocadoro = () => {
        timerHeight.value = withTiming(0, timing);
        timerOpacity.value = withTiming(0, { duration: 100 });
        avocadoroHeight.value = withTiming(100, timing);
        avocadoroOpacity.value = withDelay(
            100,
            withTiming(1, { duration: 100 }),
        );
    };

    const openTimerCloseAvocadoro = () => {
        timerHeight.value = withTiming(100, timing);
        timerOpacity.value = withDelay(100, withTiming(1, { duration: 100 }));
        avocadoroOpacity.value = withTiming(0, { duration: 100 });
        avocadoroHeight.value = withTiming(0, timing);
    };

    const onCompleteHandler = async (minutes: number): Promise<void> => {
        setMessage("");

        // TEST MODE
        if (minutes === 0.15) {
            console.log("Test");
            setAvocadoroAmount((prev) => prev + 1);
            setTotalMinutes((prev) => prev + focusTimer);
            return;
        }

        // Insert data
        const { data, error } = await supabase
            .from("sessions")
            .insert({
                session_group_id: id,
                duration_minutes: minutes,
            })
            .select();

        setAvocadoroAmount((prev) => prev + 1);
        setTotalMinutes((prev) => prev + focusTimer);

        if (error) {
            setMessage(error.message);
        }
    };

    const messageTimer = (): void => {
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        messageTimerRef.current = setTimeout(() => {
            setMessage("");
        }, 5000);
        setMessage("Reset the timer first!");
        return;
    };

    return (
        <>
            <AnimatedRoot />
            <View style={styles.root}>
                <View style={styles.topView}>
                    <View>
                        <GoBackButton
                            onPress={() => {
                                if (timerOn) {
                                    messageTimer();
                                } else {
                                    router.back();
                                }
                            }}
                        />
                    </View>
                    <View style={styles.titleView}>
                        <Text style={styles.titleText}>{name}</Text>
                    </View>
                    <View>
                        <Button
                            title={
                                <Ionicons
                                    name="pencil"
                                    size={Sizes.buttonIcon}
                                />
                            }
                            onPress={() => {
                                if (timerOn) {
                                    messageTimer();
                                } else {
                                    router.navigate({
                                        pathname: "/add-group",
                                        params: {
                                            groupId: id,
                                            groupName: name,
                                            groupFocusTimer: focusTimer,
                                            groupBreakTimer: breakTimer,
                                        },
                                    });
                                }
                            }}
                            icon={true}
                            accessibilityLabel="edit-button"
                        />
                    </View>
                </View>
                <View style={styles.middleView}>
                    <Animated.View
                        style={[avocadoroAnimatedStyle, styles.avocadoroView]}
                    >
                        <View style={styles.insideMiddleView}>
                            <View style={styles.totalTimeView}>
                                <Text style={styles.totalTimeLabel}>
                                    Total focus time
                                </Text>
                                <Text style={styles.totalTimeValue}>
                                    {totalTime}
                                </Text>
                            </View>
                            <AvocadoroPrint amount={avocadoroAmount} />
                        </View>
                        <View style={styles.slideButtonView}>
                            <Button
                                title={
                                    <Ionicons
                                        name="chevron-up"
                                        size={Sizes.buttonIcon}
                                    />
                                }
                                icon={true}
                                onPress={() => {
                                    openTimerCloseAvocadoro();
                                }}
                                accessibilityLabel="up-button"
                            />
                        </View>
                    </Animated.View>
                    <Animated.View
                        style={[timerAnimatedStyle, styles.timerView]}
                    >
                        <View style={styles.slideButtonView}>
                            <Button
                                title={
                                    <Ionicons
                                        name="chevron-down"
                                        size={Sizes.buttonIcon}
                                    />
                                }
                                icon={true}
                                onPress={() => closeTimerOpenAvocadoro()}
                                accessibilityLabel="down-button"
                            />
                        </View>
                        <View style={styles.insideMiddleView}>
                            <Timer
                                onComplete={(minutes) =>
                                    onCompleteHandler(minutes)
                                }
                                focusTimer={focusTimer}
                                breakTimer={breakTimer}
                            />
                            <Text style={styles.messageText}>{message}</Text>
                        </View>
                    </Animated.View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    root: rootStyles,
    topView: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: Sizes.topBottomHeight,
        width: "100%",
    },
    titleView: {
        justifyContent: "center",
        width: "50%",
    },
    titleText: {
        ...textDefault,
        textAlign: "center",
        fontSize: Sizes.titleSize,
    },
    middleView: {
        flex: 1,
        width: "100%",
    },
    slideButtonView: {
        alignItems: "center",
    },
    text: {
        ...textDefault,
    },
    avocadoroView: {
        backgroundColor: Colors.background2,
        overflow: "hidden",
    },
    totalTimeView: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: Sizes.gTotalTimeViewMargin,
    },
    totalTimeLabel: {
        ...textDefault,
        fontSize: Sizes.gTotalTimeLabel,
    },
    totalTimeValue: {
        ...textDefault,
        fontSize: Sizes.gTotalTimeValue,
        fontFamily: "MontserratBold",
    },
    timerView: {
        overflow: "hidden",
    },
    insideMiddleView: {
        flex: 1,
    },
    messageText: {
        ...textDefault,
        fontSize: Sizes.messageText,
        textAlign: "center",
        marginTop: Sizes.messageMarginTop,
        marginHorizontal: Sizes.messageMargin,
        color: "red",
    },
});
