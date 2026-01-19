import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Change depending on the screen
const windowSize = windowWidth > windowHeight ? windowHeight : windowWidth;

export const Sizes = {
    // Button
    buttonFont: windowSize * 0.06,
    buttonIcon: windowSize * 0.08,
    buttonIconWidth: windowSize * 0.16,
    buttonPadding: windowSize * 0.04,
    buttonBorderRadius: windowSize * 0.1,
    buttonMargin: windowSize * 0.01,

    // Input
    inputFont: windowSize * 0.05,
    inputPadding: windowSize * 0.05,
    inputMargin: windowSize * 0.01,
    inputBorderRadius: windowSize * 0.1,
    inputWidth: windowSize * 0.6,

    // Logo
    loginLogo: windowSize * 0.5
};
