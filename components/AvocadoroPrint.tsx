import { Sizes } from "@/constants/Sizes";
import { textDefault } from "@/constants/Styles";
import { FlatList, StyleSheet, View } from "react-native";
import RotatingLogo from "./UI/RotatingLogo";

type AvocadoroPrintProps = {
    amount: number;
};

export default function AvocadoroPrint({ amount }: AvocadoroPrintProps) {
    // numColumns depends on Sizes.apLogoWidth !!!

    const numOfColumns: number =
        Math.ceil(
            (Sizes.windowSize -
                2 * Sizes.rootMargin -
                2 * Sizes.rootPaddingHorizontal) /
                Sizes.apLogoWidth,
        ) - 1;

    return (
        <View style={styles.root}>
            <FlatList
                columnWrapperStyle={styles.row} // Add this
                data={Array(amount).fill(null)}
                keyExtractor={(item, index) => index.toString()}
                numColumns={numOfColumns}
                renderItem={({ index }) => (
                    <View style={styles.logo}>
                        <RotatingLogo />
                    </View>
                )}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: "center",
    },
    row: {
        justifyContent: 'flex-start'
    },
    logo: {
        aspectRatio: 0.8,
        width: Sizes.apLogoWidth,
    },
    text: textDefault,
});
