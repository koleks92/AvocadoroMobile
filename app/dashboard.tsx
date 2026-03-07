import SessionGroup from "@/components/SessionGroup";
import AnimatedRoot from "@/components/UI/AnimatedRoot";
import Button from "@/components/UI/Button";
import { Sizes } from "@/constants/Sizes";
import { rootStyles, textDefault } from "@/constants/Styles";
import { useAvocadoro } from "@/store/AvocadoroContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type SessionGroups = {
    id: string;
    name: string;
    focus_timer: number;
    break_timer: number;
    total_minutes: number;
};

export default function Dashboard() {
    const router = useRouter();

    const [sessionGroups, setSessionGroups] = useState<SessionGroups[]>([]);

    const { supabase, session } = useAvocadoro();

    // Load session group from supabase database and calculate total time
    const loadGroups = useCallback(async () => {
        if (!session?.user) return;

        const { data, error } = await supabase
            .from("session_groups")
            .select(
                `
                id,
                name,
                focus_timer,
                break_timer,
                sessions ( duration_minutes )
            `,
            )
            .eq("user_id", session.user.id);

        if (error) {
            console.error("Error loading groups:", error);
        } else {
            const groupsWithTotals = data.map((group) => ({
                ...group,
                total_minutes: group.sessions.reduce(
                    (sum, s) => sum + (s.duration_minutes || 0),
                    0,
                ),
            }));
            setSessionGroups(groupsWithTotals);
        }
    }, [session]);

    // Run whenever focuse or session changed
    useFocusEffect(
        useCallback(() => {
            if (!session) {
                router.navigate("/");
                return;
            }

            loadGroups();
        }, [session, loadGroups]),
    );

    async function signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
    }

    return (
        <>
            <AnimatedRoot />
            <View style={styles.root}>
                <View style={styles.topView}>
                    <Button
                        title={
                            <MaterialIcons
                                name="logout"
                                size={Sizes.buttonIcon}
                            />
                        }
                        onPress={() => {
                            signOut();
                        }}
                        accessibilityLabel="logout-button"
                        icon={true}
                    />
                    <View style={styles.titleView}>
                        <Text style={styles.titleText}>Sessions</Text>
                    </View>
                    <Button
                        title={
                            <MaterialIcons name="add" size={Sizes.buttonIcon} />
                        }
                        onPress={() => {
                            router.navigate("/add-group");
                        }}
                        icon={true}
                        accessibilityLabel="add-button"
                    />
                </View>
                <View style={styles.middleView}>
                    <FlatList
                        data={sessionGroups}
                        ListFooterComponent={() => (
                            <>
                                {/* FOR TEST ONLY !!!
                                <SessionGroup
                                    name="TMS"
                                    id="123123123"
                                    totalMinutes={0}
                                    focusTimer={0.1}
                                    breakTimer={0.1}
                                /> */}
                                <SessionGroup name="Add new" addNew={true} />
                            </>
                        )}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <SessionGroup
                                id={item.id}
                                name={item.name}
                                totalMinutes={item.total_minutes}
                                focusTimer={item.focus_timer}
                                breakTimer={item.break_timer}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
                <View style={styles.bottomView}>
                    <Button
                        title={
                            <MaterialIcons
                                name="settings"
                                size={Sizes.buttonIcon}
                            />
                        }
                        onPress={() => {
                            router.navigate("/settings");
                        }}
                        accessibilityLabel="settings-button"
                        icon={true}
                    />
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    root: { ...rootStyles },
    topView: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: Sizes.topBottomHeight,
        width: "100%",
    },
    middleView: {
        flex: 1,
        marginVertical: Sizes.dashboardMarginTop,
        width: "100%",
    },
    bottomView: {
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
    text: {
        ...textDefault,
    },
});
