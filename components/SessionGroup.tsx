import { Colors } from "@/constants/Colors";
import { Sizes } from "@/constants/Sizes";
import { textDefault } from "@/constants/Styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type SessionGroupProps = {
    id?: string;
    name: string;
    focusTimer?: number;
    breakTimer?: number;
    totalMinutes?: number;
    addNew?: boolean;
}

export default function SessionGroup({
    id,
    name,
    focusTimer,
    breakTimer,
    totalMinutes,
    addNew,
}: SessionGroupProps) {
    const [time, setTime] = useState<string>("0:00h");
    const router = useRouter();

    useEffect(() => {
        function convertTime(): void {
            if (totalMinutes) {
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;

                // Pad with leading zeros if needed
                const paddedHours = String(hours).padStart(2, "0");
                const paddedMinutes = String(minutes).padStart(2, "0");

                setTime(`${paddedHours}:${paddedMinutes}h`);
            }
        }

        convertTime();
    }, []);

    return (
        <Pressable
            style={({ pressed }) => [styles.root, pressed && styles.pressed]}
            onPress={() => {
                if (addNew) {
                    router.navigate("/add-group");
                } else {
                    router.navigate({
                        pathname: "/group",
                        params: {
                            id: id,
                            name: name,
                            totalMinutes: totalMinutes?.toString(),
                            focusTimer: focusTimer?.toString(),
                            breakTimer: breakTimer?.toString(),
                        },
                    });
                }
            }}
        >
            <View style={styles.titleView}>
                <Text style={styles.titleText}>{name}</Text>
            </View>
            {addNew ? (
                <View style={styles.addView}>
                    <MaterialIcons
                        name="add"
                        color={Colors.white}
                        size={Sizes.sgAdd}
                    />
                </View>
            ) : (
                <>
                    <View style={styles.totalView}>
                        <Text style={styles.totalText}>Total time</Text>
                        <Text style={styles.totalText}>{time}</Text>
                    </View>
                    <View style={styles.timesView}>
                        <View style={styles.timeView}>
                            <Text style={styles.totalText}>Focus</Text>
                            <Text style={styles.totalText}>
                                {focusTimer}min
                            </Text>
                        </View>
                        <View style={styles.timeView}>
                            <Text style={styles.totalText}>Break</Text>
                            <Text style={styles.totalText}>
                                {breakTimer}min
                            </Text>
                        </View>
                    </View>
                </>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: Colors.background3,
        padding: Sizes.sgRootPadding,
        borderRadius: Sizes.sgBorderRadius,
        margin: Sizes.sgMargin,
        minHeight: Sizes.sgHeight,
    },
    pressed: {
        backgroundColor: Colors.primaryDarkGreen,
    },
    titleView: { justifyContent: "center", alignItems: "center" },
    titleText: { ...textDefault, fontSize: Sizes.sgTitle, textAlign: 'center' },
    addView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    totalView: { justifyContent: "center", alignItems: "center" },
    totalText: textDefault,
    timesView: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    timeView: {
        justifyContent: "center",
        alignItems: "center",
    },
});
