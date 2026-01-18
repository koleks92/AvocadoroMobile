import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Change depending on the screen
const windowSize = windowWidth > windowHeight ? windowHeight: windowWidth;

export const Sizes = {
    buttonFont: windowSize * 0.06,
    buttonPadding: windowSize * 0.04,
    buttonBorderRadius: windowSize * 0.10,
    buttonMargin: windowSize * 0.01
};
