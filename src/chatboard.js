import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatBoard = () => {
  // Local states
  const [query, setQuery] = useState(""); // Student's initial question
  const [response, setResponse] = useState(""); // AI's answer
  const [loading, setLoading] = useState(false);
  // conversationStage: 0 = initial state; 1 = asking for more detail; 2 = ask for teacher explanation
  const [conversationStage, setConversationStage] = useState(0);

  // Replace this with your actual API key (ideally stored in .env)
  const API_KEY = "AIzaSyD7vL-QRY9Zwqo4PLRpIcC-pKAnSZ1SZDY";
  const genAI = new GoogleGenerativeAI(API_KEY);

  // Function to call Gemini API for answering/elaboration
  const fetchAIResponse = async (prompt) => {
    setLoading(true);
    try {
      // Use the appropriate model (adjust the model name if needed)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      // The API might require an array of prompts; adjust if needed
      const result = await model.generateContent([prompt]);
      // Parse the result (adjust based on actual API response structure)
      const text =
        result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received.";
      setResponse(text);
    } catch (error) {
      console.error("API Error:", error);
      setResponse("Error fetching response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle initial question submission
  const handleInitialQuestion = async () => {
    if (!query) return;
    await fetchAIResponse(query);
    // After initial answer, move to stage 1 to ask if more detail is needed.
    setConversationStage(1);
  };

  // Handle student's reply in the conversation flow
  const handleUserReply = async (reply) => {
    // Stage 1: Asking "Do you need a more detailed explanation?"
    if (conversationStage === 1) {
      if (reply.toLowerCase() === "yes") {
        // Ask AI to elaborate further
        await fetchAIResponse(response + " Please provide more details.");
        // Stay in stage 1 so that the student can be asked again if needed.
      } else if (reply.toLowerCase() === "no") {
        // Move to stage 2: Ask if teacher explanation is needed.
        setConversationStage(2);
      }
    }
    // Stage 2: Asking "Do you need teacher explanation?"
    else if (conversationStage === 2) {
      if (reply.toLowerCase() === "yes") {
        // Forward the doubt to the teacher.
        forwardDoubtToTeacher();
      } else if (reply.toLowerCase() === "no") {
        // End the conversation—optionally reset or display a closing message.
        setResponse("Okay. Let us know if you have further questions.");
        setConversationStage(0);
      }
    }
  };

  // Function to simulate forwarding the doubt to the teacher
  const forwardDoubtToTeacher = () => {
    // Here you would typically make an API call to your backend to store the doubt.
    console.log("Forwarding doubt to teacher:", { question: query, response });
    setResponse("Your doubt has been forwarded to the teacher for further clarification.");
    // Reset conversation stage after forwarding.
    setConversationStage(0);
  };

  return (
    <div className="container mt-4 p-4 border rounded">
      {/* If no answer has been fetched yet, show the initial input */}
      {response === "" && conversationStage === 0 ? (
        <>
          <h3>Ask a Doubt</h3>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Type your doubt here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="btn btn-primary mt-2"
            onClick={handleInitialQuestion}
            disabled={loading}
          >
            {loading ? "Asking..." : "Ask AI"}
          </button>
        </>
      ) : (
        <>
          {/* Display AI response */}
          <div className="mt-3 p-3 border rounded bg-light">
            <h5>AI Response:</h5>
            <p>{response}</p>
          </div>
          {/* Stage 1: Ask if more detailed explanation is needed */}
          {conversationStage === 1 && (
            <div className="mt-3">
              <p>Do you need a more detailed explanation?</p>
              <button
                className="btn btn-success me-2"
                onClick={() => handleUserReply("yes")}
              >
                Yes
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleUserReply("no")}
              >
                No
              </button>
            </div>
          )}
          {/* Stage 2: Ask if teacher explanation is needed */}
          {conversationStage === 2 && (
            <div className="mt-3">
              <p>Do you need teacher explanation?</p>
              <button
                className="btn btn-success me-2"
                onClick={() => handleUserReply("yes")}
              >
                Yes
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleUserReply("no")}
              >
                No
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatBoard;
