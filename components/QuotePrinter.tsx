import { Sizes } from "@/constants/Sizes";
import { textDefault } from "@/constants/Styles";
import { memo, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAvocadoro } from "../store/AvocadoroContext";

type Quote = {
    quote: string;
    author: string;
};

export default memo(function QuotePrinter() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [currentQuote, setCurrentQuote] = useState<Quote>();

    const { supabase } = useAvocadoro();

    useEffect(() => {
        async function loadQuotes() {
            const { data, error } = await supabase.from("quotes").select(`
                    quote,
                    author
                    `);

            if (data) {
                setQuotes(data);
                selectRandomQuote(data);
            }
            if (error) {
                console.log(error);
            }
        }

        loadQuotes();
    }, []);

    useEffect(() => {
        if (quotes.length === 0) return;

        const FIVE_MINUTES_MS = 5 * 60 * 1000;

        const intervalId = setInterval(() => {
            selectRandomQuote(quotes);
        }, FIVE_MINUTES_MS);

        return () => clearInterval(intervalId);
    }, [quotes]);

    function selectRandomQuote(quotes: Quote[]) {
        if (quotes.length === 0) return;

        const randomIndex = Math.floor(Math.random() * quotes.length);

        setCurrentQuote(quotes[randomIndex]);
    }

    if (currentQuote) {
        return (
            <View style={styles.root}>
                <Text style={styles.quoteText} accessibilityLabel="quote-quote">
                    {currentQuote.quote}
                </Text>
                <Text
                    style={styles.quoteAuthor}
                    accessibilityLabel="quote-author"
                >
                    {currentQuote.author}
                </Text>
            </View>
        );
    } else {
        return <View style={styles.root}></View>;
    }
});

const styles = StyleSheet.create({
    root: {
        flex: 1,
        width: "80%",
    },
    quoteText: {
        ...textDefault,
        textAlign: "center",
        fontSize: Sizes.quoteText,
    },
    quoteAuthor: {
        ...textDefault,
        flex: 1,
        textAlign: "right",
        fontStyle: "italic",
        fontSize: Sizes.quoteAuthor,
    },
});
