import ShakingLogo from "@/components/UI/AvocadoroImage";
import Button from "@/components/UI/Button";
import InputField from "@/components/UI/Input";
import { Sizes } from "@/constants/Sizes";
import { textDefault } from "@/constants/Styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";

export default function Index() {
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const googleSignIn = async (): Promise<void> => {
        console.log("TODO");
    };

    const appleSignIn = async (): Promise<void> => {
        console.log("TODO");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.root}>
                    <View style={styles.logoInputView}>
                        <ShakingLogo />
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
                    </View>
                    <View style={styles.buttonsView}>
                        <Button
                            title="Log In"
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
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        ...textDefault,
    },
    logoInputView: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
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
    }
});
