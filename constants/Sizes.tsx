import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Change depending on the screen
const windowSize = windowWidth > windowHeight ? windowHeight : windowWidth;

export const Sizes = {
    // Root sizes
    rootMargin: windowSize * 0.04,
    rootPadding: windowSize * 0.04,

    // Button
    buttonFont: windowSize * 0.05,
    buttonIcon: windowSize * 0.07,
    buttonIconWidth: windowSize * 0.2,
    buttonPadding: windowSize * 0.04,
    buttonBorderRadius: windowSize * 0.1,
    buttonMargin: windowSize * 0.02,

    // Input
    inputFont: windowSize * 0.04,
    inputPadding: windowSize * 0.05,
    inputMargin: windowSize * 0.02,
    inputBorderRadius: windowSize * 0.1,
    inputWidth: windowSize * 0.6,

    // Logo
    loginLogo: windowSize * 0.6,

    // Index/Login
    dontText: windowSize * 0.04,
    messageText: windowSize * 0.04,
    messageMargin: windowSize * 0.05,
    messageMarginTop: windowSize * 0.03
};
