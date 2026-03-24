import { FlashList } from "@shopify/flash-list";
import { useCallback, useState } from "react";
import { View } from "react-native";
import RotatingLogo from "./UI/RotatingLogo";

type AvocadoroPrintProps = {
    amount: number;
};

export default function AvocadoroPrint({ amount }: AvocadoroPrintProps) {
    const [logoWidth, setLogoWidth] = useState<number>(10);

    const renderItem = useCallback(() => {
        return (
            <View
                style={{
                    aspectRatio: 0.8,
                    width: logoWidth,
                }}
            >
                <RotatingLogo />
            </View>
        );
    }, [logoWidth]);

    return (
        <View
        style={{flex: 1}}
            onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setLogoWidth(width / 10);
            }}
        >
            <FlashList
                data={Array(amount).fill(null)}
                keyExtractor={(item, index) => index.toString()}
                numColumns={10}
                renderItem={renderItem}
            />
        </View>
    );
}
