import { useRef, useState } from 'react';
import React from "react";
const NotesAISummary = ({ notes }) => {
  const modalRef = useRef();
  const resultsRef = useRef();
  const [stream, setStream] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleAISummary = async () => {
    setFetching(true); // Start fetching
    setSummary(null);
    const API_URL = `${import.meta.env.VITE_PROXY_OPENAI
      }/api/v1/chat/completions`;
    const API_KEY = `${import.meta.env.VITE_KEY_OPENAI}`;
    const inputContent = notes.map((note) => note.content).join("\n"); // Join all contents of notes into a single string
    // If stream is active:
    if (stream) {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${API_KEY}`,
            mode: "production",
            provider: "open-ai",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are an assistant summarizing notes.",
              },
              {
                role: "user",
                content: inputContent,
              },
            ],
            max_tokens: 200,
            stream: true, // Enable streaming
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch AI summary.");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let resultText = "";
        // Read the stream
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          // Decode the chunk and parse it
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");
          for (const line of lines) {
            if (line.startsWith("data:")) {
              const json = line.substring(5).trim();
              if (json === "[DONE]") {
                return; // Data streaming completed.
              }
              try {
                const parsed = JSON.parse(json);
                const content = parsed.choices[0].delta?.content || "";
                // printing the received part
                resultsRef.current.innerText += content;
              } catch (error) {
                console.error("JSON parse error:", error);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error while streaming AI summary:", error);
        resultsRef.current.innerText =
          "Failed to fetch summary. Please try again.";
      } finally {
        setFetching(false); // Stop fetching
      }
    } else {
      /// If stream is off:
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${API_KEY}`,
            mode: "production",
            provider: "open-ai",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are an assistant summarizing notes.",
              },
              {
                role: "user",
                content: inputContent,
              },
            ],
            max_tokens: 200,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch AI summary.");
        }
        const data = await response.json();
        const message = data?.message?.content || "No summary available.";
        // The summary text is displayed here.
        resultsRef.current.innerText = message;
        setSummary(message);
        setFetching(false);
      } catch (error) {
        console.error("Error while fetching AI summary:", error);
        resultsRef.current.innerText =
          "Failed to fetch summary. Please try again.";
      }
    }
  };

  return (
    <>
      <div className='fixed bottom-4 right-4'>
        <button
          onClick={() => modalRef.current.showModal()}
          className='bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full shadow-lg w-10 h-10'
        >
          ✨
        </button>
      </div>
      <dialog id='modal-note' className='modal' ref={modalRef}>
        <div className='modal-box h-[600px] py-0'>
          <div className='modal-action items-center justify-between mb-2'>
            <h1 className='text-2xl text-center'>Get AI Gen summary</h1>
            <label htmlFor='Stream?' className='flex items-center gap-1'>
              Stream?
              <input
                id='Stream?'
                type='checkbox'
                className='toggle toggle-error'
                checked={stream}
                onChange={() => setStream(p => !p)}
              />
            </label>

            <form method='dialog'>
              <button className='btn'>&times;</button>
            </form>
          </div>
          <div className='flex flex-col items-center gap-3'>
            <div
              className='textarea textarea-success w-full h-[400px] overflow-y-scroll'
              ref={resultsRef}
            >
              AI SUMMARY GOES HERE
            </div>
            <button
              className='mt-5 btn bg-purple-500 hover:bg-purple-400 text-white'
              onClick={handleAISummary}
            >
              Gen AI summary ✨
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NotesAISummary;
