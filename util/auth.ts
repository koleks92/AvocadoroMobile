import {
    GoogleSignin,
    isErrorWithCode,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import { SupabaseClient } from "@supabase/supabase-js";
import * as AppleAuthentication from "expo-apple-authentication";
import { Keyboard } from "react-native";
import { emailValidation, passwordValidation } from "./validation";

// Signup with email and password function
export async function signUpHandler(
    email: string,
    password: string,
    passwordConfirm: string,
    supabase: SupabaseClient,
    setMessage: (message: string) => void,
): Promise<void> {
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
}

// Signin with email and password function
export async function signInHandler(
    email: string,
    password: string,
    supabase: SupabaseClient,
    setMessage: (message: string) => void,
): Promise<void> {
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
}

// Google signin function
export async function signInGoogleHandler(
    supabase: SupabaseClient,
    setMessage: (message: string) => void,
): Promise<void> {
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

export async function signInAppleHandler(
    supabase: SupabaseClient,
    setMessage: (message: string) => void,
): Promise<void> {
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

// Delete account function
export async function deleteAccount(supabase: SupabaseClient): Promise<void> {
    const { error: rpcError } = await supabase.rpc("delete_user");

    if (rpcError) {
        console.error("Error deleting account via RPC:", rpcError.message);
        return;
    }

    await supabase.auth.signOut();
}
