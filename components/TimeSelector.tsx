import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "./UI/Button";

type TimeSelectorProps = {
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    onClick: (number: number) => void;
};

export default function TimeSelector({
    min,
    max,
    step,
    defaultValue,
    onClick,
}: TimeSelectorProps) {
    const [selected, setSelected] = useState<number>(defaultValue);

    useEffect(() => {
        onClick(selected);
    }, [selected]);

    const times: number[] = [];

    for (let i: number = min; i <= max; i += step) {
        times.push(i);
    }
    
    return (
        <View style={styles.root}>
            {times.map((time) => {
                return (
                    <View key={time} style={styles.buttonWrapper}>
                    <Button
                        key={time}
                        title={time}
                        onPress={() => setSelected(time)}
                        icon={true}
                        timer={true}
                        isSelected={time === selected}
                    />
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        display: "flex",
        width: "80%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonWrapper: {
        width: '25%', 
        justifyContent: 'center',
        alignItems: 'center'
    }
});
