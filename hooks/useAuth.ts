import { emailValidation, passwordValidation } from "@/util/validation";
import { SupabaseClient } from "@supabase/supabase-js";
import { Keyboard } from "react-native";
import {
    GoogleSignin,
    isErrorWithCode,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";


export function useAuth(
    email: string,
    password: string,
    passwordConfirm: string,
    supabase: SupabaseClient,
    setMessage: (message: string) => void,
) {
    const signUpHandler = async (): Promise<void> => {
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

    const signInHandler = async (): Promise<void> => {
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

    const signInGoogleHandler = async (): Promise<void> => {
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
    }

    const signInAppleHandler = async (): Promise<void> => {
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
    } 

    return {
        signUpHandler,
        signInHandler,
        signInGoogleHandler,
        signInAppleHandler
    };
}
