import TimeSelector from "@/components/TimeSelector";
import AnimatedRoot from "@/components/UI/AnimatedRoot";
import Button from "@/components/UI/Button";
import GoBackButton from "@/components/UI/GoBackButton";
import InputField from "@/components/UI/Input";
import { Sizes } from "@/constants/Sizes";
import { rootStyles, textDefault } from "@/constants/Styles";
import { useAvocadoro } from "@/store/AvocadoroContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Keyboard,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

export default function AddGroup() {
    const router = useRouter();

    const { session, supabase, setSession } = useAvocadoro();

    const [buttonWidth, setButtonWidth] = useState<number>(0);

    const [focusTimer, setFocusTimer] = useState<number>(25);
    const [breakTimer, setBreakTimer] = useState<number>(5);

    const [name, setName] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    async function addNewGroupHandler(): Promise<void> {
        setMessage("");

        // Check if name provided
        if (!name || name === "") {
            setMessage("Missing avocadoro name");
            return;
        }

        // Double check if logged in correctly
        if (!session?.user.id) {
            setMessage("Something went wrong,\n please try again!");
            return;
        }

        // Check if already in database
        const { data: existingGroup, error: fetchError } = await supabase
            .from("session_groups")
            .select("*")
            .eq("user_id", session.user.id)
            .eq("name", name.trim())
            .maybeSingle();

        if (fetchError) {
            console.error("Error checking for existing group:", fetchError);
            return;
        }

        if (existingGroup && existingGroup.id) {
            setMessage("You already have a group\n with that name.");
            return;
        }

        // Insert new data
        const { data, error } = await supabase
            .from("session_groups")
            .insert({
                user_id: session.user.id,
                name: name.trim(),
                focus_timer: focusTimer,
                break_timer: breakTimer,
            })
            .select();

        if (data) {
            router.navigate("/dashboard");
        }

        if (error) {
            setMessage(error.message);
        }
    }

    return (
        <>
            <AnimatedRoot />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.root}>
                    <View style={styles.topView}>
                        <View
                            onLayout={(event) => {
                                const { width } = event.nativeEvent.layout;
                                setButtonWidth(width);
                            }}
                        >
                            <GoBackButton
                                onPress={() => {
                                    router.back();
                                }}
                            />
                        </View>
                        <View style={styles.titleView}>
                            <Text style={styles.titleText}>Add Group</Text>
                        </View>
                        <View style={{ width: buttonWidth }}></View>
                    </View>
                    <View style={styles.middleView}>
                        <View style={styles.nameView}>
                            <InputField
                                placeholder="Avocadoro name"
                                value={name}
                                onChangeText={(val) => {
                                    setName(val);
                                }}
                                inputMode="text"
                                accessibilityLabel="name-field"
                            />
                        </View>
                        <View style={styles.timeView}>
                            <Text style={styles.timeText}>
                                Focus time in minutes
                            </Text>
                            <TimeSelector
                                min={5}
                                max={60}
                                step={5}
                                defaultValue={focusTimer}
                                onClick={(time) => setFocusTimer(time)}
                            />
                        </View>
                        <View style={styles.timeView}>
                            <Text style={styles.timeText}>
                                Break time in minutes
                            </Text>
                            <TimeSelector
                                min={5}
                                max={60}
                                step={5}
                                defaultValue={breakTimer}
                                onClick={(time) => setBreakTimer(time)}
                            />
                        </View>
                        <View style={styles.buttonView}>
                            <Button
                                title="Add"
                                onPress={() => {
                                    addNewGroupHandler();
                                }}
                                accessibilityLabel="add-button"
                            />
                            <Text style={styles.messageText}>{message}</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
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
    },
    titleText: {
        ...textDefault,
        fontSize: Sizes.titleSize,
    },
    middleView: {
        flex: 1,
    },
    nameView: {
        justifyContent: "center",
        alignItems: "center",
    },
    timeView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: Sizes.agTimeViewMarginTop,
    },
    timeText: {
        ...textDefault,
        fontSize: Sizes.agTimeText,
    },
    buttonView: {
        alignItems: 'center'
    },
    messageText: {
        ...textDefault,
        fontSize: Sizes.messageText,
        textAlign: "center",
        marginHorizontal: Sizes.messageMargin / 2,
        color: "red",
    },
});
