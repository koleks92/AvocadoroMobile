import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Change depending on the screen
const windowSize = windowWidth > windowHeight ? windowHeight : windowWidth;

export const Sizes = {
    // Root sizes
    rootMargin: windowSize * 0.04,
    rootPadding: windowSize * 0.04,
    buttonInputHeight: windowSize * 0.16,
    smallButtonHeight: windowSize * 0.15,
    titleSize: windowSize * 0.07,

    // Button
    buttonFont: windowSize * 0.05,
    buttonPadding: windowSize * 0.04,
    buttonIcon: windowSize * 0.07,
    buttonIconWidth: windowSize * 0.2,
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
    messageMarginTop: windowSize * 0.03,

    // Dashboard
    dashboardtopBottomHeight: windowSize * 0.2,
    dashboardMarginTop: windowSize * 0.01,

    // SessionGroup component
    sgHeight: windowSize * 0.4,
    sgRootPadding: windowSize * 0.04,
    sgBorderRadius: windowSize * 0.04,
    sgTitle: windowSize * 0.04,
    sgTotalTime: windowSize * 0.035,
    sgAdd: windowSize * 0.16,
    sgMargin: windowSize * 0.01
};
