import TimeSelector from "@/components/TimeSelector";
import AnimatedRoot from "@/components/UI/AnimatedRoot";
import Button from "@/components/UI/Button";
import GoBackButton from "@/components/UI/GoBackButton";
import InputField from "@/components/UI/Input";
import { Sizes } from "@/constants/Sizes";
import { rootStyles, textDefault } from "@/constants/Styles";
import { useAvocadoro } from "@/store/AvocadoroContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Keyboard,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

export default function AddGroup() {
    const router = useRouter();

    // Read values from the route
    const { groupId, groupName, groupFocusTimer, groupBreakTimer, anonymous } =
        useLocalSearchParams();

    const { session, supabase, message, setMessage } = useAvocadoro();

    const [buttonWidth, setButtonWidth] = useState<number>(0);

    const [focusTimer, setFocusTimer] = useState<number>(25);
    const [breakTimer, setBreakTimer] = useState<number>(5);

    const [loading, setLoading] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [anonymousMode, setAnonymousMode] = useState<boolean>(false);
    const [deleteView, setDeleteView] = useState<boolean>(false);
    const [id, setId] = useState<string>("");

    const [name, setName] = useState<string>("");

    useEffect(() => {
        if (!groupId) return;

        if (groupId) {
            setLoading(true);
            setId(groupId as string);
            setName(groupName as string);
            setFocusTimer(Number(groupFocusTimer as string));
            setBreakTimer(Number(groupBreakTimer as string));
            setEditMode(true);
        }
    }, [groupId]);

    useEffect(() => {
        if (anonymous === "true") {
            setAnonymousMode(true);
        }
    }, [anonymous]);

    // Make sure that UI catches up with the state update
    useEffect(() => {
        if (
            focusTimer === Number(groupFocusTimer as string) &&
            breakTimer === Number(groupBreakTimer as string)
        ) {
            setLoading(false);
        }
    }, [focusTimer, breakTimer]);

    // Add/Edit new session group
    async function saveGroupHandler(): Promise<void> {
        setMessage("");

        // Check if name provided
        if (!name || name.trim() === "") {
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

        if (existingGroup && existingGroup.id !== id) {
            setMessage("You already have a group\n with that name.");
            return;
        }

        if (editMode) {
            // Edit session group
            const { data, error } = await supabase
                .from("session_groups")
                .update({
                    name: name.trim(),
                    focus_timer: focusTimer,
                    break_timer: breakTimer,
                })
                .eq("id", id)
                .select();

            if (data) {
                router.navigate("/dashboard");
            }

            if (error) {
                setMessage(error.message);
            }
        } else {
            // Insert new data (new session group)
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
    }

    // Delete group session
    async function deleteGroupHandler(): Promise<void> {
        const { data, error } = await supabase
            .from("session_groups")
            .delete()
            .eq("id", id)
            .select();

        if (error) {
            setMessage(error.message);
        }

        if (data) {
            router.navigate("/dashboard");
        }
    }

    // Create anonymous session
    function createAnonymousGroup(): void {
        router.navigate({
            pathname: "/group",
            params: {
                name: "",
                focusTimer: focusTimer,
                breakTimer: breakTimer,
                anonymous: "true",
            },
        });
    }

    if (loading) {
        return;
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
                                    {
                                        deleteView
                                            ? setDeleteView(false)
                                            : router.back();
                                    }
                                }}
                            />
                        </View>
                        {!anonymousMode && (
                            <>
                                <View style={styles.titleView}>
                                    <Text style={styles.titleText}>
                                        {editMode ? groupName : "Add Group"}
                                    </Text>
                                </View>
                                <View style={{ width: buttonWidth }}>
                                    {editMode && !deleteView && (
                                        <Button
                                            title={
                                                <MaterialIcons
                                                    name="delete-outline"
                                                    size={Sizes.buttonIcon}
                                                />
                                            }
                                            onPress={() => {
                                                setDeleteView(true);
                                            }}
                                            icon={true}
                                            accessibilityLabel="delete-button"
                                        />
                                    )}
                                </View>
                            </>
                        )}
                    </View>
                    <View style={styles.middleView}>
                        {deleteView ? (
                            <View style={styles.deleteView}>
                                <Text style={styles.deleteText}>
                                    Are you sure ?
                                </Text>
                                <Button
                                    title="Delete"
                                    onPress={() => deleteGroupHandler()}
                                    accessibilityLabel="delete-button-confirm"
                                    deleteButton={true}
                                />
                            </View>
                        ) : (
                            <>
                                {!anonymousMode && (
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
                                )}
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
                                    {editMode && (
                                        <Button
                                            title="Update"
                                            onPress={() => {
                                                saveGroupHandler();
                                            }}
                                            accessibilityLabel="update-button"
                                        />
                                    )}
                                    {anonymousMode && (
                                        <Button
                                            title="Create"
                                            onPress={() => {
                                                createAnonymousGroup();
                                            }}
                                            accessibilityLabel="anonymous-button"
                                        />
                                    )}
                                    {!anonymousMode && !editMode && (
                                        <Button
                                            title="Add"
                                            onPress={() => {
                                                saveGroupHandler();
                                            }}
                                            accessibilityLabel="add-button"
                                        />
                                    )}
                                    <Text style={styles.messageText}>
                                        {message}
                                    </Text>
                                </View>
                            </>
                        )}
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
        alignItems: "center",
        width: "50%",
    },
    titleText: {
        ...textDefault,
        textAlign: "center",
        fontSize: Sizes.titleSize,
    },
    middleView: {
        flex: 1,
        justifyContent: "flex-start",
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
        alignItems: "center",
    },
    messageText: {
        ...textDefault,
        fontSize: Sizes.messageText,
        textAlign: "center",
        marginHorizontal: Sizes.messageMargin / 2,
        color: "red",
    },
    deleteView: {
        flex: 1,
        justifyContent: "center",
    },
    deleteText: {
        ...textDefault,
        fontSize: Sizes.agDeleteText,
    },
});
