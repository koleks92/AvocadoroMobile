import AvocadoroPrint from "@/components/AvocadoroPrint";
import AnimatedRoot from "@/components/UI/AnimatedRoot";
import Button from "@/components/UI/Button";
import GoBackButton from "@/components/UI/GoBackButton";
import { Colors } from "@/constants/Colors";
import { Sizes } from "@/constants/Sizes";
import { rootStyles, textDefault } from "@/constants/Styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type SessionGroupProps = {
    id: string;
    name: string;
    focusTimer: string;
    breakTimer: string;
    totalMinutes: string;
};

export default function Group() {
    const router = useRouter();

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

    useEffect(() => {
        setAvocadoroAmount(Math.floor(totalMinutes / focusTimer));
        convertTime();
    }, [totalMinutes]);

    // Animation refs
    const timerHeight = useRef(new Animated.Value(100)).current;
    const timerOpacity = useRef(new Animated.Value(1)).current;

    const avocadoroHeight = useRef(new Animated.Value(0)).current;
    const avocadoroOpacity = useRef(new Animated.Value(0)).current;

    // Interpolation to percentages
    const timerHeightInterpolated = timerHeight.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
    });

    const avocadoroHeightInterpolated = avocadoroHeight.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
    });

    // Animation down
    const slideDownAnimation = () => {
        Animated.parallel([
            Animated.timing(timerHeight, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.timing(avocadoroHeight, {
                toValue: 100,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.sequence([
                Animated.timing(timerOpacity, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: false,
                }),
                Animated.timing(avocadoroOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: false,
                }),
            ]),
        ]).start();
    };

    // Animation up
    const slideUpAnimation = () => {
        Animated.parallel([
            Animated.timing(timerHeight, {
                toValue: 100,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.timing(avocadoroHeight, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            }),
            Animated.sequence([
                Animated.timing(avocadoroOpacity, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: false,
                }),
                Animated.timing(timerOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: false,
                }),
            ]),
        ]).start();
    };

    return (
        <>
            <AnimatedRoot />
            <View style={styles.root}>
                <View style={styles.topView}>
                    <View>
                        <GoBackButton
                            onPress={() => {
                                router.back();
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
                                router.navigate({
                                    pathname: "/add-group",
                                    params: {
                                        groupId: id,
                                        groupName: name,
                                        groupFocusTimer: focusTimer,
                                        groupBreakTimer: breakTimer,
                                    },
                                });
                            }}
                            icon={true}
                            accessibilityLabel="edit-button"
                        />
                    </View>
                </View>
                <View style={styles.middleView}>
                    <Animated.View
                        style={[
                            {
                                height: avocadoroHeightInterpolated,
                                opacity: avocadoroOpacity,
                            },
                            styles.avocadoroView,
                        ]}
                    >
                        <View style={styles.insideMiddleView}>
                            <View style={styles.totalTimeView}> 
                                <Text style={styles.totalTimeLabel}>Total focus time</Text>
                                <Text style={styles.totalTimeValue}>{totalTime}</Text>
                            </View>
                            <AvocadoroPrint amount={avocadoroAmount} />
                        </View>
                        <Button
                            title={
                                <Ionicons
                                    name="chevron-up"
                                    size={Sizes.buttonIcon}
                                />
                            }
                            onPress={() => {
                                slideUpAnimation();
                            }}
                        />
                    </Animated.View>
                    <Animated.View
                        style={[
                            {
                                height: timerHeightInterpolated,
                                opacity: timerOpacity,
                            },
                            styles.timerView,
                        ]}
                    >
                        <Button
                            title={
                                <Ionicons
                                    name="chevron-down"
                                    size={Sizes.buttonIcon}
                                />
                            }
                            onPress={() => slideDownAnimation()}
                        />
                        <View style={styles.insideMiddleView}>
                            <Text style={styles.text}>Timer</Text>
                        </View>
                    </Animated.View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    root: rootStyles,
    modalRoot: {
        flex: 1,
        margin: Sizes.rootMargin,
        paddingHorizontal: Sizes.rootPaddingHorizontal,
        paddingVertical: Sizes.rootPaddingVertical,
    },
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
    text: {
        ...textDefault,
    },
    avocadoroView: {
        backgroundColor: Colors.background2,
        overflow: "hidden",
    },
    totalTimeView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Sizes.gTotalTimeViewMargin
    },
    totalTimeLabel: {
        ...textDefault,
        fontSize: Sizes.gTotalTimeLabel
    },
    totalTimeValue: {
        ...textDefault,
        fontSize: Sizes.gTotalTimeValue,
        fontFamily: "MontserratBold"
    },
    timerView: {
        overflow: "hidden",
    },
    insideMiddleView: {
        flex: 1,
    },
});
