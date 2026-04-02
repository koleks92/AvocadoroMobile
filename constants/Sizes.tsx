import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Change depending on the screen
const windowSize = windowWidth > windowHeight ? windowHeight : windowWidth;

export const Sizes = {
    // Root sizes
    windowSize: windowSize,
    rootMargin: windowSize * 0.04,
    rootPaddingHorizontal: windowSize * 0.02,
    rootPaddingVertical: windowSize * 0.02,
    buttonInputHeight: windowSize * 0.16,
    smallButtonHeight: windowSize * 0.15,
    titleSize: windowSize * 0.055,
    topBottomHeight: windowSize * 0.2,

    // Button component
    buttonFont: windowSize * 0.05,
    buttonPadding: windowSize * 0.04,
    buttonIcon: windowSize * 0.07,
    buttonIconWidth: windowSize * 0.2,
    buttonBorderRadius: windowSize * 0.1,
    buttonMargin: windowSize * 0.02,

    // Input component
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
    dashboardMarginTop: windowSize * 0.01,

    // SessionGroup component
    sgHeight: windowSize * 0.4,
    sgRootPadding: windowSize * 0.04,
    sgBorderRadius: windowSize * 0.04,
    sgTitle: windowSize * 0.04,
    sgTotalTime: windowSize * 0.035,
    sgAdd: windowSize * 0.16,
    sgMargin: windowSize * 0.01,

    // Add-group
    agTimeText: windowSize * 0.04,
    agTimeViewMarginTop: windowSize * 0.1,
    agDeleteText: windowSize * 0.06,
    agDeleteMargin: windowSize * 0.1,

    // Settings
    settingsPadding: windowSize * 0.1,
    settingsText: windowSize * 0.05,
    settingsTextMargin: windowSize * 0.04,

    // AvocadoroPrint component
    apLogoWidth: windowSize * 0.1,

    // Group
    gTotalTimeLabel: windowSize * 0.05,
    gTotalTimeValue: windowSize * 0.06,
    gTotalTimeViewMargin: windowSize * 0.04,

    // Timer component
    timerTitleText: windowSize * 0.15,
    timerTimeText: windowSize * 0.2,

    // QuotePrinter component
    quoteText: windowSize * 0.044,
    quoteAuthor: windowSize * 0.04, 

    // Modal
    modalTextMargin: windowSize * 0.08,
    modalTextSize: windowSize * 0.04,
    modalTitleText: windowSize * 0.06
};
