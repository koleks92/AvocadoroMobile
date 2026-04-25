import AvocadoroPrint from "@/components/AvocadoroPrint";
import Timer from "@/components/Timer";
import AnimatedRoot from "@/components/UI/AnimatedRoot";
import Button from "@/components/UI/Button";
import GoBackButton from "@/components/UI/GoBackButton";
import { Colors } from "@/constants/Colors";
import { Sizes } from "@/constants/Sizes";
import { rootStyles, textDefault } from "@/constants/Styles";
import { useGroup } from "@/hooks/useGroup";
import { useAvocadoro } from "@/store/AvocadoroContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export default function Group() {
    const router = useRouter();

    const { timerOn, message } = useAvocadoro();

    // useGroup Hook
    const {
        id,
        name,
        focusTimer,
        breakTimer,
        anonymousMode,
        totalSeconds,
        setTotalSeconds,
        supabaseFinishTime,
        transferRecived,
        avocadoroAmount,
        totalTime,
        modalVisible,
        setModalVisible,
        transferStatus,
        transferStatusText,
        transferTimer,
        onCompleteHandler,
        messageTimer,
    } = useGroup();

    // ANIMATIONS

    // Root animated style
    const rootOpacity = useSharedValue(1);
    const rootAnimatedStyle = useAnimatedStyle(() => ({
        opacity: rootOpacity.value,
    }));

    useEffect(() => {
        if (modalVisible) {
            rootOpacity.value = 0.5;
        } else {
            rootOpacity.value = 1;
        }
    }, [modalVisible]);

    // Shared values — translate instead of height
    const timerTranslateY = useSharedValue(0);
    const timerOpacity = useSharedValue(1);
    const avocadoroTranslateY = useSharedValue(1000); // starts offscreen below
    const avocadoroOpacity = useSharedValue(0);

    // Animation styles
    const timerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: timerTranslateY.value }],
        opacity: timerOpacity.value,
    }));

    const avocadoroAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: avocadoroTranslateY.value }],
        opacity: avocadoroOpacity.value,
    }));

    // Animation timings
    const OpacityTiming = { duration: 500, easing: Easing.inOut(Easing.ease) };
    const TranslateTiming = {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
    };

    // Close timer, open avocadoro card styles
    const closeTimerOpenAvocadoro = () => {
        timerOpacity.value = withTiming(0, OpacityTiming);
        timerTranslateY.value = withTiming(1000, TranslateTiming); // slide down out

        avocadoroOpacity.value = withTiming(1, OpacityTiming);
        avocadoroTranslateY.value = withTiming(0, TranslateTiming); // slide up into view
    };

    const openTimerCloseAvocadoro = () => {
        avocadoroOpacity.value = withTiming(0, OpacityTiming);
        avocadoroTranslateY.value = withTiming(1000, TranslateTiming); // slide down out

        timerOpacity.value = withTiming(1, OpacityTiming);
        timerTranslateY.value = withTiming(0, TranslateTiming); // slide up into view
    };

    return (
        <>
            <AnimatedRoot />
            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalRoot}>
                    <View style={styles.modalInnerView}>
                        <View style={styles.topView}>
                            <View>
                                <Button
                                    title={
                                        <Ionicons
                                            name="close"
                                            size={Sizes.buttonIcon}
                                        />
                                    }
                                    onPress={() => {
                                        setModalVisible(false);
                                    }}
                                />
                            </View>
                            <View style={styles.modalTitleView}>
                                <Text style={styles.modalTitleText}>
                                    Transfer
                                </Text>
                            </View>
                            <View pointerEvents="none" style={{ opacity: 0 }}>
                                <Button
                                    title={
                                        <Ionicons
                                            name="close"
                                            size={Sizes.buttonIcon}
                                        />
                                    }
                                    onPress={() => {
                                        setModalVisible(false);
                                    }}
                                />
                            </View>
                        </View>
                        <View style={styles.modalMiddleView}>
                            <Button
                                title={transferStatus}
                                onPress={() => transferTimer()}
                                withBackground={true}
                            />
                            <View>
                                <Text style={styles.modalText}>
                                    {transferStatusText}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Group Screen */}
            <Animated.View style={[styles.root, rootAnimatedStyle]}>
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
                    {!anonymousMode && (
                        <>
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
                        </>
                    )}
                </View>
                <View style={styles.middleView}>
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFill,
                            avocadoroAnimatedStyle,
                            styles.avocadoroView,
                        ]}
                    >
                        {!anonymousMode && (
                            <View style={styles.slideButtonView}>
                                <Button
                                    title={
                                        <Ionicons
                                            name="chevron-down"
                                            size={Sizes.buttonIcon}
                                        />
                                    }
                                    iconNoSpace={true}
                                    onPress={() => {
                                        openTimerCloseAvocadoro();
                                    }}
                                    accessibilityLabel="down-button"
                                />
                            </View>
                        )}
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
                            <View style={styles.messageView}>
                                <Text style={styles.messageText}>
                                    {message}
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFill,
                            timerAnimatedStyle,
                            styles.timerView,
                        ]}
                    >
                        {!anonymousMode && (
                            <View style={styles.slideButtonView}>
                                <Button
                                    title={
                                        <Ionicons
                                            name="chevron-down"
                                            size={Sizes.buttonIcon}
                                        />
                                    }
                                    iconNoSpace={true}
                                    onPress={() => closeTimerOpenAvocadoro()}
                                    accessibilityLabel="down-button"
                                />
                            </View>
                        )}
                        <View style={styles.insideMiddleView}>
                            <Timer
                                onComplete={(minutes, finishTime) =>
                                    onCompleteHandler(minutes, finishTime)
                                }
                                focusTimer={focusTimer}
                                breakTimer={breakTimer}
                                supabaseId={id}
                                supabaseFinishTime={supabaseFinishTime}
                                onTotalSecondsChange={(seconds) =>
                                    setTotalSeconds(seconds)
                                }
                                transferRecived={transferRecived}
                            />
                            {!anonymousMode && (
                                <View style={styles.bottomView}>
                                    <View style={styles.bottomButtonView}>
                                        <Button
                                            title={
                                                <MaterialIcons
                                                    name="transfer-within-a-station"
                                                    size={Sizes.buttonIcon}
                                                />
                                            }
                                            icon={true}
                                            onPress={() =>
                                                setModalVisible(true)
                                            }
                                            accessibilityLabel="down-button"
                                        />
                                    </View>
                                    <View style={styles.messageView}>
                                        <Text style={styles.messageText}>
                                            {message}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </Animated.View>
                </View>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    root: rootStyles,
    modalRoot: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalInnerView: {
        ...rootStyles,
        flex: undefined,
        justifyContent: "center",
        alignItems: "center",
        width: "75%",
        height: "40%",
    },
    modalMiddleView: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    modalTitleView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalTitleText: {
        ...textDefault,
        fontSize: Sizes.modalTitleText,
    },
    modalText: {
        ...textDefault,
        margin: Sizes.modalTextMargin,
        textAlign: "center",
        fontSize: Sizes.modalTextSize,
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
        justifyContent: "center",
        width: "100%",
        overflow: "hidden",
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
        height: "100%",
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
        height: "100%",
    },
    insideMiddleView: {
        flex: 1,
    },
    bottomView: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
    },
    bottomButtonView: {
        width: "20%",
    },
    messageView: {
        width: "60%",
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
