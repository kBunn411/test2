"use client";
import styles from "@/app/styles.module.css";
import { useState } from "react";

export default function Generate() {
    const [theInput, setTheInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [responseContent, setResponseContent] = useState(
        "Enter the ingredients of the recipe you would like to generate."
    );

    const prompt = "Give me a recipe with the ingredients below: ";

    const callGetResponse = async () => {
        setIsLoading(true);
        const userMessage = { role: "user", content: prompt + theInput };
        setTheInput("");

        try {
            const response = await fetch("/api/openai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: [userMessage] }), // Send only the user's input
            });

            const output = await response.json();

            if (output) {
                setResponseContent(output.content); // Update with the assistant's latest response
            }
        } catch (error) {
            console.error("Error fetching response:", error);
            setResponseContent("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (!isLoading) callGetResponse();
        }
    };

    return (
        <div className={styles.card}>
            <div
                style={{
                    width: "max",
                    maxWidth: "18rem",
                    padding: "3px 4px",
                    height: "min",
                }}
                className="w-max max-w-[18rem] rounded-md px-4 py-3 h-min bg-gray-200 text-gray-800"
            >
                {responseContent}
            </div>
            <textarea
                value={theInput}
                onChange={e => setTheInput(e.target.value)}
                className="w-[85%] h-10 px-3 py-2 resize-none overflow-y-auto text-black bg-gray-300 rounded-l outline-none"
                onKeyDown={handleSubmit}
                disabled={isLoading}
            />
            <button
                onClick={callGetResponse}
                className="w-[15%] bg-blue-500 px-4 py-2 rounded-r"
                disabled={isLoading}
            >
                {isLoading ? "Loading..." : "Generate"}
            </button>
        </div>
    );
}
