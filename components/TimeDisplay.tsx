import { Sizes } from "@/constants/Sizes";
import { textDefault } from "@/constants/Styles";
import { memo } from "react";
import { StyleSheet, Text } from "react-native";

export default memo(function TimeDisplay({ totalSeconds }: { totalSeconds: number }) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return (
        <Text style={styles.timeText}>
            {String(minutes).padStart(2, "0")[0]}
            {String(minutes).padStart(2, "0")[1]}:
            {String(seconds).padStart(2, "0")[0]}
            {String(seconds).padStart(2, "0")[1]}
        </Text>
    );
});

const styles = StyleSheet.create({
    timeText: {
        ...textDefault,
        fontSize: Sizes.timerTimeText,
        fontVariant: ["tabular-nums"],
    },
});
