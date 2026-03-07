import AnimatedRoot from "@/components/UI/AnimatedRoot";
import Button from "@/components/UI/Button";
import GoBackButton from "@/components/UI/GoBackButton";
import InputField from "@/components/UI/Input";
import ShakingLogo from "@/components/UI/ShakingLogo";
import { Sizes } from "@/constants/Sizes";
import { rootStyles, textDefault } from "@/constants/Styles";
import { useAvocadoro } from "@/store/AvocadoroContext";
import { emailValidation, passwordValidation } from "@/util/validation";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
    GoogleSignin,
    isErrorWithCode,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import { JwtPayload } from "@supabase/supabase-js";
import * as AppleAuthentication from "expo-apple-authentication";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

const webClientId: string = process.env.EXPO_PUBLIC_WEBCLIENT_ID!;
const iosClientId: string = process.env.EXPO_PUBLIC_IOSCLIENT_ID!;

export default function Index() {
    const router = useRouter();

    const { session, supabase, setSession, message, setMessage } =
        useAvocadoro();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [signUpView, setSignUpView] = useState<boolean>(false);

    const [authLoaded, setAuthLoaded] = useState(false);

    const [claims, setClaims] = useState<JwtPayload | null>(null);

    useEffect(() => {
        // Clean up message
        setMessage("");

        // Google signin configuration
        GoogleSignin.configure({
            webClientId,
            iosClientId,
        });

        // Initial Session Load ---
        supabase.auth.getClaims().then(({ data }) => {
            if (data) setClaims(data.claims);
        });

        // Supabase Real-time Listener ---
        const { data: listener } = supabase.auth.onAuthStateChange(() => {
            supabase.auth.getClaims().then(({ data }) => {
                if (data) {
                    setClaims(data.claims);
                }
            });
        });
        
        setAuthLoaded(true);

        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (session) {
            router.navigate("/dashboard");
        }
    }, [session, authLoaded]);

    // SignUp with email and password
    const signUp = async (): Promise<void> => {
        setMessage("");
        Keyboard.dismiss();

        // Email validation: must include "@" and "."
        const emailIsValid = emailValidation(email);

        // Password validation:
        // must be >= 10 characters and contain at least 1 digit
        const passwordIsValid = passwordValidation(password);

        // Confirm password validation
        // Must be the same as password
        const confirmPasswordIsValid = password === passwordConfirm;

        if (emailIsValid && passwordIsValid && confirmPasswordIsValid) {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                setMessage(error.message);
            }
        } else {
            if (!emailIsValid) {
                setMessage("Incorrect email");
                return;
            }

            if (!passwordIsValid) {
                setMessage(
                    "Password must be >= 10 characters and contain at least 1 digit",
                );
                return;
            }

            if (!confirmPasswordIsValid) {
                setMessage("Passwords must be the same");
                return;
            }
        }
    };

    // Email and password signin
    const signIn = async (): Promise<void> => {
        setMessage("");
        Keyboard.dismiss();

        // Email validation: must include "@" and "."
        const emailIsValid = emailValidation(email);

        // Password validation:
        // must be >= 10 characters and contain at least 1 digit
        const passwordIsValid = passwordValidation(password);

        if (emailIsValid && passwordIsValid) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                console.error("Signin error:", error);
                setMessage(error.message);
                return;
            }

            if (data) {
                console.log("Signin success:", data);
            }
        } else {
            if (!emailIsValid) {
                setMessage("Incorrect email");
                return;
            }

            if (!passwordIsValid) {
                setMessage(
                    "Password must be >= 10 characters and contain at least 1 digit",
                );
                return;
            }
        }
    };

    // Google signin
    const googleSignIn = async (): Promise<void> => {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if (response.data?.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: "google",
                    token: response.data.idToken,
                });

                if (error) {
                    setMessage("Error occured, please try again :)");
                }
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        break;
                    default:
                        setMessage("Error occured, please try again :)");
                }
            } else {
                setMessage("Error occured, please try again :)");
            }
        }
    };

    const appleSignIn = async (): Promise<void> => {
        try {
            const response = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            if (response?.identityToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: "apple",
                    token: response.identityToken,
                });

                if (error) {
                    setMessage("Error occured, please try again :)");
                }
            }
        } catch (error) {
            setMessage("Error occured, please try again :)");
        }
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
                                    <GoBackButton
                                        onPress={() => setSignUpView(false)}
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
                                    accessibilityLabel="email-field"
                                />
                                <InputField
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={(val) => setPassword(val)}
                                    inputMode="text"
                                    password={true}
                                    accessibilityLabel="password-field"
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
                                        accessibilityLabel="confirm-field"
                                    />
                                )}
                            </View>
                            {signUpView ? (
                                <View style={styles.buttonsView}>
                                    <Button
                                        title="Sign Up"
                                        onPress={() => {
                                            signUp();
                                        }}
                                        accessibilityLabel="signup-button"
                                    />
                                </View>
                            ) : (
                                <View style={styles.buttonsView}>
                                    <Button
                                        title="Sign In"
                                        onPress={() => {
                                            signIn();
                                        }}
                                        accessibilityLabel="signin-button"
                                    />
                                    <View style={styles.socialView}>
                                        <Button
                                            title={
                                                <FontAwesome
                                                    name="google"
                                                    size={Sizes.buttonIcon}
                                                />
                                            }
                                            accessibilityLabel="google-button"
                                            onPress={() => googleSignIn()}
                                            icon={true}
                                        />
                                        {Platform.OS === "ios" && (
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
                                        )}
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
                            <Text style={styles.messageText}>{message}</Text>
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
        justifyContent: "center",
    },
    logo: {
        height: Sizes.loginLogo,
    },
    disabledView: {
        opacity: 0,
    },
    messageText: {
        ...textDefault,
        fontSize: Sizes.messageText,
        textAlign: "center",
        marginTop: Sizes.messageMarginTop,
        marginHorizontal: Sizes.messageMargin,
        color: "red",
    },
});
