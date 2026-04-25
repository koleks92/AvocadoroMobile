// hooks/useGroup.ts
import { useAvocadoro } from "@/store/AvocadoroContext";
import { cancelTransfer, finishTransfer, startTransfer } from "@/util/startFinishTransfer";
import { convertTime } from "@/util/extra";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

type TransferType = "Recive" | "Send";

type SessionGroupParams = {
    id: string;
    name: string;
    focusTimer: string;
    breakTimer: string;
    totalMinutes: string;
    anonymous: string;
};

export function useGroup() {
    const { supabase, timerOn, timerMode, setMessage } = useAvocadoro();
    const params = useLocalSearchParams<SessionGroupParams>();

    const [name] = useState(params.name || "");
    const [focusTimer] = useState(Number(params.focusTimer) || 25);
    const [breakTimer] = useState(Number(params.breakTimer) || 5);
    const [id] = useState(params.id || "");
    const [anonymousMode] = useState(params.anonymous === "true");

    const [totalMinutes, setTotalMinutes] = useState(Number(params.totalMinutes) || 0);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [avocadoroAmount, setAvocadoroAmount] = useState(0);
    const [totalTime, setTotalTime] = useState("");
    const [supabaseFinishTime, setSupabaseFinishTime] = useState("");
    const [transferRecived, setTransferRecived] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [transferStatus, setTransferStatus] = useState<TransferType>("Recive");
    const [transferStatusText, setTransferStatusText] = useState("");

    const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const transferChannelRef = useRef<any>(null);

    // Set status on modal visible
    useEffect(() => {
        if (!timerOn) {
            setTransferStatus("Recive");
            setTransferStatusText("Ready to recive timer!");
        } else {
            setTransferStatus("Send");
            setTransferStatusText("Ready to send timer!");
        }
    }, [modalVisible]);

    // Open modal if availivle timer to recive
    useEffect(() => {
        const checkTimer = async () => {
            const { data } = await supabase
                .from("session_groups")
                .select("timer_on, finish_time")
                .eq("id", id)
                .single();

            if (data?.timer_on) setModalVisible(true);
        };

        checkTimer();
        return () => {
            if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        };
    }, []);

    // Set total time
    useEffect(() => {
        setAvocadoroAmount(Math.floor(totalMinutes / focusTimer));
        setTotalTime(convertTime(totalMinutes));
    }, [totalMinutes]);


    // Stop listening for real time database
    const stopListening = () => {
        if (transferChannelRef.current) {
            supabase.removeChannel(transferChannelRef.current);
            transferChannelRef.current = null;
        }
    };

    // Transfer timer function
    const transferTimer = async () => {
        if (transferStatus === "Recive") {
            const { data } = await supabase
                .from("session_groups")
                .select("timer_on, finish_time")
                .eq("id", id)
                .single();

            if (data?.timer_on) {
                setSupabaseFinishTime(data.finish_time);
                finishTransfer(supabase, id);
                setModalVisible(false);
            } else {
                setTransferStatusText("Transfer failed!\nTry again!");
            }
        }

        if (transferStatus === "Send") {
            if (timerMode !== "focus") {
                setTransferStatusText("Cannot transfer break!");
                return;
            }

            startTransfer(supabase, totalSeconds, id);
            setTransferStatusText("Sending...");

            transferChannelRef.current = supabase
                .channel("transfer-channel")
                .on("postgres_changes", {
                    event: "UPDATE",
                    schema: "public",
                    table: "session_groups",
                    filter: `id=eq.${id}`,
                }, (payload) => {
                    if (payload.new.transfer_status === "recived") {
                        setModalVisible(false);
                        stopListening();
                        setTransferRecived(true);
                        setTimeout(() => setTransferRecived(false), 5000);
                    }
                })
                .subscribe();

            setTimeout(() => {
                stopListening();
                cancelTransfer(supabase, id);
                setTransferStatusText("Transfer failed!\nTry again!");
            }, 30000);
        }
    };

    // onComplete function
    const onCompleteHandler = async (minutes: number, finishTime: number) => {
        setMessage("");

        if (minutes === 0.1) {
            setAvocadoroAmount((prev) => prev + 1);
            setTotalMinutes((prev) => prev + focusTimer);
            return;
        }

        if (!anonymousMode) {
            const { error } = await supabase
                .from("sessions")
                .insert({
                    session_group_id: id,
                    duration_minutes: minutes,
                    finish_time: new Date(finishTime).toISOString(),
                })
                .select();

            if (error) {
                setMessage("Cannot save data.\n Are you running a timer on another device ?");
                setTimeout(() => setMessage(""), 15000);
            }
        }

        setAvocadoroAmount((prev) => prev + 1);
        setTotalMinutes((prev) => prev + focusTimer);
    };

    // Messege state
    const messageTimer = () => {
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        messageTimerRef.current = setTimeout(() => setMessage(""), 5000);
        setMessage("Reset the timer first!");
    };

    return {
        // group info
        id, name, focusTimer, breakTimer, anonymousMode,
        // timer
        totalSeconds, setTotalSeconds, supabaseFinishTime, transferRecived,
        // stats
        avocadoroAmount, totalTime,
        // modal
        modalVisible, setModalVisible, transferStatus, transferStatusText,
        // handlers
        transferTimer, onCompleteHandler, messageTimer,
    };
}