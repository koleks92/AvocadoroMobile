import AnimatedRoot from "@/components/UI/AnimatedRoot";
import Button from "@/components/UI/Button";
import GoBackButton from "@/components/UI/GoBackButton";
import InputField from "@/components/UI/Input";
import ShakingLogo from "@/components/UI/ShakingLogo";
import { Sizes } from "@/constants/Sizes";
import { rootStyles, textDefault } from "@/constants/Styles";
import { useAuth } from "@/hooks/useAuth";
import { useAvocadoro } from "@/store/AvocadoroContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { JwtPayload } from "@supabase/supabase-js";
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

    const { session, supabase, message, setMessage } =
        useAvocadoro();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [signUpView, setSignUpView] = useState<boolean>(false);

    const [authLoaded, setAuthLoaded] = useState(false);

    const [claims, setClaims] = useState<JwtPayload | null>(null);

    // Auth hook
    const {
        signUpHandler,
        signInHandler,
        signInGoogleHandler,
        signInAppleHandler,
    } = useAuth({ email, password, passwordConfirm });

    // Initial load useEffect
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

    // Check if logged in
    useEffect(() => {
        if (session) {
            router.navigate("/dashboard");
        }
    }, [session, authLoaded]);

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
                                            signUpHandler();
                                        }}
                                        accessibilityLabel="signup-button"
                                    />
                                </View>
                            ) : (
                                <View style={styles.buttonsView}>
                                    <Button
                                        title="Sign In"
                                        onPress={() => {
                                            signInHandler();
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
                                            onPress={() =>
                                                signInGoogleHandler()
                                            }
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
                                                onPress={() =>
                                                    signInAppleHandler()
                                                }
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
                            <Pressable
                                onPress={() => {
                                    router.navigate({
                                        pathname: "/add-group",
                                        params: { anonymous: "true" },
                                    });
                                }}
                                accessibilityLabel="anonymous-button"
                            >
                                <Text style={styles.messageText}>
                                    Continue without an account
                                </Text>
                            </Pressable>
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
