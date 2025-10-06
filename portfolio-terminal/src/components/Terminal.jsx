import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { terminalData } from "../assets/assets";

export default function Terminal() {
  const terminalRef = useRef(null);
  const [lines, setLines] = useState(["Type 'help' to get started..."]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [fullLines, setFullLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showPrompt, setShowPrompt] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const typingRef = useRef(null);

  // === Utility: Format URLs ===
  const formatText = (text) => {
    const urlRegex = /\[https?:\/\/(.*?)\]/g;
    return text.replace(urlRegex, (match) => {
      const url = match.slice(1, -1);
      const name = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
      return `<a href="${url}" target="_blank" class="text-blue-400 underline">${name}</a>`;
    });
  };

  // === Command Lists ===
  const projectList = terminalData.projects
    .map(
      (p, i) =>
        `${i + 1}. ${p.title}${
          p.demo ? ` - [${p.demo}]` : p.github ? ` - [${p.github}]` : ""
        }`
    )
    .join("\n");

  const certificateList = terminalData.certificates
    .map((c, i) => `${i + 1}. ${c.title}${c.link ? ` - ${c.link}` : ""}`)
    .join("\n");

  // === Commands ===
  const commands = {
    help:
      "Available commands:\n- about\n- projects\n- skills\n- experience\n- education\n- certifications\n- contact\n- resume\n- clear",
    sudo: "Hello!👋 I'm Shigivahan Athithan",
    about:
      "Hello!👋 I'm Shigivahan Athithan, a Full Stack Developer and Data Science Enthusiast.\n\nI enjoy designing intelligent, user-friendly applications and leveraging data to solve complex problems in real-world domains like healthcare, finance, and education.\n\nWith hands-on experience in React, Node.js, Python, TensorFlow, and SQL, I have built projects ranging from machine learning research published in IEEE/Scopus to hackathon-winning web apps.\n\nBeyond coding, I love exploring new technologies, contributing to open source, and constantly challenging myself to grow as a developer and analyst.\n\n",
    projects: projectList,
    skills:
      "\n- React\n- Next.js\n- Tailwind\n- CSS\n- Node.js\n- Express.js\n- MongoDB\n- Python\n- TensorFlow\n- Power BI\n- Framer Motion\n- Git\n- Figma\n",
    experience:
      "Built and deployed production-level web apps integrating AI and analytics. Experienced in full-stack (MERN) and ML-based interfaces.",
    education:
      "Education:\n\
1. Kalasalingam Academy of Research and Education — B.Tech in Computer Science (Aug 2021 – Jun 2025)\n\
• Cumulative GPA: 8.37\n\n\
2. Nxtwave Disruptive Technologies (Jun 2022 – Present)\n\
• Industry Ready Certification in Full-Stack Development\n\n\
3. Sakthi Vinayakar Hindu Vidyalaya — Intermediate (Jun 2020 – Apr 2021)\n\
• Percentage: 80.4\n\n\
4. Good Shepherd Model School — Secondary (Jun 2018 – Apr 2019)\n\
• Percentage: 85.7",
    certifications: certificateList,
    contact:
      "📫 Get In Touch:\n\nEmail: shigivahanathithan@gmail.com\nPhone: +91 93447-18155\nGitHub: [https://github.com/ShigivahanA]\nLinkedIn: [https://linkedin.com/in/shigivahana]\n\nFeel free to reach out!",
    clear: "clear",
  };

  // === Handle Resume Command ===
const handleResumeDownload = () => {
  const resumeURL = "/Shigivahan_Resume.pdf"; 

  const promptLine = `<span class='text-blue-400'>shigi@portfolio:~$</span> <span class='text-green-400'>resume</span>`;
  setLines((prev) => [...prev, promptLine, "Downloading resume.pdf ..."]);

  // Fake countdown
  let countdown = 3;
  const countdownInterval = setInterval(() => {
    setLines((prev) => [...prev, `Downloading in ${countdown}...`]);
    countdown--;
    if (countdown === 0) {
      clearInterval(countdownInterval);

      // === Start fake progress bar ===
      let progress = 0;
      const totalSteps = 20;
      const progressInterval = setInterval(() => {
        progress++;
        const bar =
          "[" +
          "#".repeat(progress) +
          "-".repeat(totalSteps - progress) +
          `] ${(progress * 5)}%`;
        setLines((prev) => [...prev, bar]);

        if (progress >= totalSteps) {
          clearInterval(progressInterval);

          // Trigger actual download
          const link = document.createElement("a");
          link.href = resumeURL;
          link.download = "Shigivahan_Resume.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Fake stats for realism
          const fileSize = (Math.random() * 1.5 + 1.5).toFixed(2); // 1.5–3MB
          const duration = (Math.random() * 1.2 + 0.8).toFixed(2); // 0.8–2s

          setTimeout(() => {
            setLines((prev) => [
              ...prev,
              `<span class='text-green-400'>Successfully downloaded resume.pdf (${fileSize} MB in ${duration}s)</span>`,
            ]);
            setShowPrompt(true);
          }, 800);
        }
      }, 100); // progress speed
    }
  }, 800);
};

  // === Handle Commands ===
  const handleCommand = (cmd) => {
    const lower = cmd.toLowerCase();

    if (lower === "resume") {
      setShowPrompt(false);
      handleResumeDownload();
      return;
    }

    if (lower === "clear") {
      setLines([]);
      setHistory([...history, cmd]);
      setHistoryIndex(-1);
      return;
    }

    const output = commands[lower] || `Command not found: ${cmd}`;
    const promptLine = `<span class='text-blue-400'>shigi@portfolio:~$</span> <span class='text-green-400'>${cmd}</span>`;
    setLines((prev) => [...prev, promptLine]);
    setHistory([...history, cmd]);
    setHistoryIndex(-1);
    startTyping(output);
  };

  // === Start typing ===
  const startTyping = (text) => {
    const linesArray = text.split("\n");
    setFullLines(linesArray);
    setTypedText("");
    setCurrentLineIndex(0);
    setIsTyping(true);
    setShowPrompt(false);
  };

  // === Typing effect ===
  useEffect(() => {
    if (!isTyping || fullLines.length === 0) return;

    let line = fullLines[currentLineIndex];
    let index = 0;
    let current = "";

    typingRef.current = setInterval(() => {
      current += line.charAt(index);
      setTypedText(current);
      index++;

      if (index >= line.length) {
        clearInterval(typingRef.current);
        typingRef.current = null;
        setLines((prev) => [...prev, current]);

        setTimeout(() => {
          const formatted = formatText(current);
          setLines((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = formatted;
            return updated;
          });

          if (currentLineIndex < fullLines.length - 1) {
            setTypedText("");
            setCurrentLineIndex((i) => i + 1);
          } else {
            setIsTyping(false);
            setTypedText("");
            setFullLines([]);
            setTimeout(() => setShowPrompt(true), 250);
          }
        }, 200);
      }
    }, 25);

    return () => clearInterval(typingRef.current);
  }, [isTyping, currentLineIndex, fullLines]);

  // === Ctrl + C interruption ===
  useEffect(() => {
    const handleCtrlC = (e) => {
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        if (isTyping) {
          clearInterval(typingRef.current);
          typingRef.current = null;
          setIsTyping(false);
          setTypedText("");
          setFullLines([]);

          const pid = Math.floor(Math.random() * 4000) + 1000;
          setLines((prev) => [
            ...prev,
            "^C",
            `<span class='text-gray-500'>Terminated process (pid: ${pid})</span>`,
          ]);
          setTimeout(() => setShowPrompt(true), 400);
        }
      }
    };

    window.addEventListener("keydown", handleCtrlC);
    return () => window.removeEventListener("keydown", handleCtrlC);
  }, [isTyping]);

  // === Submit ===
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    handleCommand(input.trim());
    setInput("");
  };

  // === Arrow Navigation ===
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex =
        historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex =
        historyIndex === -1 || historyIndex === history.length - 1
          ? -1
          : historyIndex + 1;
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? "" : history[newIndex]);
    }
  };

  // === Smooth Scroll ===
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [lines, typedText]);

  return (
    <motion.div
      ref={terminalRef}
      className="bg-black border border-green-700 p-3 md:p-4 rounded-lg w-full h-full overflow-y-auto shadow-inner 
                 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {lines.map((line, i) => (
        <p
          key={i}
          className="whitespace-pre-wrap text-white mb-1 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: line }}
        />
      ))}

      {isTyping && !lines.includes(typedText) && (
        <p
          className="whitespace-pre-wrap text-white mb-1 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: typedText }}
        />
      )}

{showPrompt && !isTyping && (
  <form
    onSubmit={handleSubmit}
    onKeyDown={(e) => {
      handleKeyDown(e);

      // === TAB Autocomplete (Bash-like) ===
      if (e.key === "Tab") {
        e.preventDefault(); // prevent browser focus change
        const matches = Object.keys(commands).filter((cmd) =>
          cmd.startsWith(input.toLowerCase())
        );

        if (matches.length === 1) {
          // Only one match → autocomplete it
          setInput(matches[0]);
        } else if (matches.length > 1) {
          // Multiple matches → show below (like bash)
          if (window.lastTabPress && Date.now() - window.lastTabPress < 500) {
            // Second quick Tab → list suggestions
            setLines((prev) => [
              ...prev,
              `\n${matches.join("   ")}\n`
            ]);
          }
          window.lastTabPress = Date.now();
        }
      }
    }}
    className="flex items-center"
  >
    <span className="text-blue-400 mr-2">shigi@portfolio:~$</span>

    <div className="relative flex-1 flex items-center">
      <input
        type="text"
        className="bg-transparent flex-1 outline-none text-green-400 placeholder-gray-600"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a command..."
        autoFocus
      />

      {/* === Ghost suggestion (only for single-match) === */}
      {input && (
        <span className="absolute left-0 text-green-600 opacity-30 pointer-events-none select-none">
          {
            (() => {
              const matches = Object.keys(commands).filter((cmd) =>
                cmd.startsWith(input.toLowerCase())
              );
              return matches.length === 1 ? matches[0] : "";
            })()
          }
        </span>
      )}
    </div>
  </form>
)}
    </motion.div>
  );
}
