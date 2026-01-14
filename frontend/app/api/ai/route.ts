import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, context } = body;
        const lastMessage = messages[messages.length - 1];

        // In a real implementation, you would call OpenAI/Gemini/Anthropic here.
        // const apiKey = process.env.AI_API_KEY;
        // if (!apiKey) { ... }

        // Mock Response Logic for Demo
        let responseText = "I'm the VaultGuard AI assistant. How can I help you today?";

        const lowerQuery = lastMessage.content.toLowerCase();

        if (lowerQuery.includes("scope") || lowerQuery.includes("website") || lowerQuery.includes("url")) {
            responseText = "Based on the standard vault configuration, usually only the smart contracts in the repository are in scope. Marketing websites are typically OUT of scope unless specified.";
        } else if (lowerQuery.includes("fee") || lowerQuery.includes("cost")) {
            responseText = "The platform fee is currently set to 2.5% on successful payouts. There is no fee to create a vault, but you must deposit funds.";
        } else if (lowerQuery.includes("judge") || lowerQuery.includes("review")) {
            responseText = "Judges are selected by the protocol owner. They review submissions and vote on their validity. A threshold of approvals is required for payout.";
        } else if (lowerQuery.includes("payout") || lowerQuery.includes("reward")) {
            responseText = "Payouts are automatic once the required number of judges approve your submission. Funds are sent directly to your wallet.";
        }

        // specific mock for specific questions
        if (context === "judge") {
            responseText += " (Context: Judge Portal - Tips: Verify the reproduction steps carefully.)";
        }

        return NextResponse.json({
            role: "assistant",
            content: responseText
        });

    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
