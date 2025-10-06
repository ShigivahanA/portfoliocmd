import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function AIAssistantTerminal({ trigger }) {
  const [logs, setLogs] = useState([
    "🤖 Booting neural system...",
    "Loading deep thought modules...",
    "Establishing synaptic uplink...",
    "Ready to assist your portfolio visitors.",
  ]);

  const aiRef = useRef(null);

  // Smooth autoscroll
  useEffect(() => {
    if (aiRef.current) {
      aiRef.current.scrollTo({
        top: aiRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs]);

  // Periodic idle messages
  useEffect(() => {
    const idleMessages = [
      "🧠 Monitoring user curiosity levels...",
      "💡 Analyzing previous commands...",
      "📡 Listening for sudo access requests...",
      "⚙️ Optimizing portfolio subroutines...",
    ];

    const interval = setInterval(() => {
      const msg = idleMessages[Math.floor(Math.random() * idleMessages.length)];
      setLogs((prev) => [...prev, msg]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // React to triggers from main terminal
  useEffect(() => {
    if (!trigger) return;
    let message = "";

    switch (trigger.toLowerCase()) {
      case "sudo":
        message =
          "🧠 Root privileges granted. Neural assistant online.";
        break;
      case "ask ai":
        message =
          "🤖 Hello human 👋 How may I assist your curiosity today?";
        break;
      case "clear":
        setLogs([]);
        return;
      default:
        message = `🤔 Command '${trigger}' not recognized by AI subroutine.`;
    }

    setLogs((prev) => [...prev, `> ${trigger}`, message]);
  }, [trigger]);

  return (
    <motion.div
      ref={aiRef}
      className="bg-black border border-blue-600 p-3 md:p-4 rounded-lg w-full h-full overflow-y-auto shadow-inner 
                 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {logs.map((log, i) => (
        <p
          key={i}
          className="whitespace-pre-wrap text-blue-300 mb-1 leading-relaxed"
        >
          {log}
        </p>
      ))}
    </motion.div>
  );
}
