import AnimatedRoot from "@/components/UI/AnimatedRoot";
import ShakingLogo from "@/components/UI/AvocadoroImage";
import Button from "@/components/UI/Button";
import GoBackButton from "@/components/UI/GoBackButton";
import InputField from "@/components/UI/Input";
import { Sizes } from "@/constants/Sizes";
import { rootStyles, textDefault } from "@/constants/Styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

export default function Index() {
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [signUpView, setSignUpView] = useState<boolean>(false);

    const signIn = async (): Promise<void> => {};

    const googleSignIn = async (): Promise<void> => {
        console.log("TODO");
    };

    const appleSignIn = async (): Promise<void> => {
        console.log("TODO");
    };

    return (
        <>
            <AnimatedRoot />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.root}>
                        <View style={styles.topView}>
                            {signUpView ? (
                                <View style={styles.backButtonView}>
                                    <GoBackButton
                                        onPress={() => setSignUpView(false)}
                                    />
                                </View>
                            ) : (
                                <View style={styles.disabledView}>
                                    <Button
                                        title={
                                            <Ionicons
                                                name="chevron-back"
                                                size={Sizes.buttonIcon}
                                            />
                                        }
                                        onPress={() => setSignUpView(false)}
                                        icon={true}
                                    />
                                </View>
                            )}
                            <View style={styles.logoView}>
                                <ShakingLogo />
                            </View>
                        </View>
                        <View style={styles.mainView}>
                            <View style={styles.logoInputView}>
                                <InputField
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={(val) => setEmail(val)}
                                    inputMode="email"
                                />
                                <InputField
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={(val) => setPassword(val)}
                                    inputMode="text"
                                    password={true}
                                />
                                {signUpView && (
                                    <InputField
                                        placeholder="Confirm your password"
                                        value={passwordConfirm}
                                        onChangeText={(val) =>
                                            setPasswordConfirm(val)
                                        }
                                        inputMode="text"
                                        password={true}
                                    />
                                )}
                            </View>
                            {signUpView ? (
                                <View style={styles.buttonsView}>
                                    <Button
                                        title="Sign Up"
                                        onPress={() => {
                                            router.navigate("/dashboard");
                                        }}
                                    />
                                </View>
                            ) : (
                                <View style={styles.buttonsView}>
                                    <Button
                                        title="Sign In"
                                        onPress={() => {
                                            router.navigate("/dashboard");
                                        }}
                                    />
                                    <View style={styles.socialView}>
                                        <Button
                                            title={
                                                <FontAwesome
                                                    name="google"
                                                    size={Sizes.buttonIcon}
                                                />
                                            }
                                            onPress={() => googleSignIn()}
                                            icon={true}
                                        />
                                        <Button
                                            title={
                                                <FontAwesome
                                                    name="apple"
                                                    size={Sizes.buttonIcon}
                                                />
                                            }
                                            onPress={() => appleSignIn()}
                                            icon={true}
                                        />
                                    </View>
                                </View>
                            )}
                            {!signUpView && (
                                <Pressable
                                    style={styles.dontButton}
                                    onPress={() => {
                                        setSignUpView(true);
                                    }}
                                >
                                    <Text style={styles.dontText}>
                                        Don't have an account yet
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    root: rootStyles,
    topView: {
        flex: 2,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    mainView: {
        flex: 3,
        alignItems: "center",
    },
    logoView: {
        flex: 1,
        width: Sizes.loginLogo,
        height: Sizes.loginLogo,
    },
    logoInputView: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    backButtonView: {
        display: "flex",
        width: "100%",
        alignItems: "flex-start",
    },
    dontText: {
        ...textDefault,
        fontSize: Sizes.dontText,
    },
    dontButton: {
        margin: Sizes.buttonMargin,
    },
    buttonsView: {
        display: "flex",
    },
    socialView: {
        display: "flex",
        flexDirection: "row",
    },
    logo: {
        height: Sizes.loginLogo,
    },
    disabledView: {
        opacity: 0,
    },
});
