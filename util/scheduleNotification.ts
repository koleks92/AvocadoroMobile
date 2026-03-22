import notifee, { TriggerType } from "@notifee/react-native";

// Request permision for notifications
export const requestNotifee = async () => {
    await notifee.createChannel({
        id: "avocadoro",
        name: "Avocadoro Timer",
    });
    await notifee.requestPermission();
};

// Schedule notification when app is not active
export const scheduleNotification = async (
    seconds: number,
    mode: "focus" | "break",
) => {
    await notifee.cancelAllNotifications(); // clear any previous pending

    await notifee.createTriggerNotification(
        {
            title:
                mode === "focus" ? "✅ Focus session done!" : "☕ Break over!",
            body:
                mode === "focus"
                    ? "Click to start the break mode!"
                    : "Click to start the focus mode!",
            android: {
                channelId: "avocadoro",
                pressAction: { id: "default" },
            },
            ios: {
                sound: "default",
            },
        },
        {
            type: TriggerType.TIMESTAMP,
            timestamp: Date.now() + seconds * 1000,
        },
    );
};
