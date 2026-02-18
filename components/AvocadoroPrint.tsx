import { useState } from "react";
import { FlatList, View } from "react-native";
import RotatingLogo from "./UI/RotatingLogo";

type AvocadoroPrintProps = {
    amount: number;
};

export default function AvocadoroPrint({ amount }: AvocadoroPrintProps) {
    const [logoWidth, setLogoWidth] = useState<number>(10);

    return (
        <View
            style={{
                flex: 1,
            }}
            onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setLogoWidth(width / 10);
            }}
        >
            <FlatList
                columnWrapperStyle={{ justifyContent: "flex-start" }}
                data={Array(amount).fill(null)}
                keyExtractor={(item, index) => index.toString()}
                numColumns={10}
                renderItem={() => (
                    <View
                        style={{
                            aspectRatio: 0.8,
                            width: logoWidth,
                        }}
                    >
                        <RotatingLogo />
                    </View>
                )}
            />
        </View>
    );
}
