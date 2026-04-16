import { useAvocadoro } from "@/store/AvocadoroContext";
import { Router } from "expo-router";

type AddGroupOptions = {
    id: string;
    name: string;
    focusTimer: number;
    breakTimer: number;
    editMode: boolean;
    router: Router;
}

export function useAddGroup({
    id,
    name,
    focusTimer,
    breakTimer,
    editMode,
    router,
}: AddGroupOptions) {
    // Context
    const {supabase, session, setMessage } = useAvocadoro();
    // Add/Edit new session group
    const saveGroupHandler = async (): Promise<void> => {
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
    };

    // Delete group session
    const deleteGroupHandler = async (): Promise<void> => {
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
    };

    // Create anonymous session
    const createAnonymousGroup = (): void => {
        router.navigate({
            pathname: "/group",
            params: {
                name: "",
                focusTimer: focusTimer,
                breakTimer: breakTimer,
                anonymous: "true",
            },
        });
    };

    return {
        saveGroupHandler,
        deleteGroupHandler,
        createAnonymousGroup,
        router,
    };
}
