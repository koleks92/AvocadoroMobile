import AnimatedRoot from "@/components/UI/AnimatedRoot";
import Button from "@/components/UI/Button";
import GoBackButton from "@/components/UI/GoBackButton";
import { Sizes } from "@/constants/Sizes";
import { rootStyles, textDefault } from "@/constants/Styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

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
    const { name, focusTimer, breakTimer, totalMinutes, id } =
        useLocalSearchParams<SessionGroupProps>();

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
                                        groupBreakTimer: breakTimer
                                    },
                                });
                            }}
                        />
                    </View>
                </View>
                <View style={styles.middleView}></View>
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
        textAlign: 'center',
        fontSize: Sizes.titleSize,
    },
    middleView: {
        flex: 1,
    },
    text: {
        ...textDefault,
    },
});
