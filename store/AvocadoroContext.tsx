import { supabase } from "@/lib/supabase";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { createContext, ReactNode, useEffect, useState, useContext } from "react";

// Define the shape of the context value
type AvocadoroContextType = {
    supabase: SupabaseClient;
    session: Session | null;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>;
};

// Create the context (default: null so we can handle initialization)
const AvocadoroContext = createContext<AvocadoroContextType | null>(null);

export function useAvocadoro() {
    const context = useContext(AvocadoroContext);
    if (!context) {
        throw new Error(
            "useAvocadoro must be used within an AvocadoroProvider",
        );
    }
    return context;
}

// Define props type for the Provider
type AvocadoroProviderProps = {
    children: ReactNode;
};

// The provider itself
export function AvocadoroProvider({ children }: AvocadoroProviderProps) {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth
            .getSession()
            .then(({ data: { session } }) => setSession(session));
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) =>
            setSession(session),
        );
        return () => subscription.unsubscribe();
    }, []);

    return (
        <AvocadoroContext.Provider value={{ supabase, session, setSession }}>
            {children}
        </AvocadoroContext.Provider>
    );
}
