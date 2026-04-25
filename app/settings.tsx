import { deleteAccount } from "@/util/auth";
import AnimatedRoot from "@/components/UI/AnimatedRoot";
import Button from "@/components/UI/Button";
import GoBackButton from "@/components/UI/GoBackButton";
import { Sizes } from "@/constants/Sizes";
import { rootStyles, textDefault } from "@/constants/Styles";
import { useAvocadoro } from "@/store/AvocadoroContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Settings() {
    const router = useRouter();

    const [buttonWidth, setButtonWidth] = useState<number>(0);

    const [deleteView, setDeleteView] = useState<boolean>(false);

    const { supabase } = useAvocadoro();

    // Delete account function
    async function deleteAccountHandler(): Promise<void> {
        await deleteAccount(supabase);
        router.navigate("/");
    }

    return (
        <>
            <AnimatedRoot />
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
                    <View style={styles.titleView}>
                        <Text style={styles.titleText}>Settings</Text>
                    </View>
                    <View style={{ width: buttonWidth }} />
                </View>
                <View style={styles.middleView}>
                    {deleteView ? (
                        <>
                            <Text style={styles.text}>
                                We're sorry to see you go.
                            </Text>
                            <Text style={styles.text}>
                                If you delete your account, you'll lose access
                                to your progress and saved settings forever.
                            </Text>
                            <View style={styles.buttonView}>
                                <Button
                                    title="Remove account"
                                    onPress={() => deleteAccountHandler()}
                                    deleteButton={true}
                                    accessibilityLabel="delete-button-confirm"
                                />
                            </View>
                        </>
                    ) : (
                        <Button
                            title="Remove account"
                            onPress={() => setDeleteView(true)}
                            deleteButton={true}
                            accessibilityLabel="delete-button"
                        />
                    )}
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
        padding: Sizes.settingsPadding,
    },
    text: {
        ...textDefault,
        textAlign: "center",
        fontSize: Sizes.settingsText,
        marginVertical: Sizes.settingsTextMargin,
    },
    buttonView: {
        marginVertical: Sizes.settingsTextMargin,
    },
});
