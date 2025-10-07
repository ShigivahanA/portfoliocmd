import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { projects, certificates } from "../assets/assets";

export default function Terminal({ onCommand }) {
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
  const [tabPressed, setTabPressed] = useState(false);
  const typingRef = useRef(null);
  const typingAudioRef = useRef(null);
  const [currentDir, setCurrentDir] = useState("~");

  // === Scroll Helper ===
  const scrollToBottom = (smooth = false) => {
    const container = terminalRef.current;
    if (!container) return;
    try {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    } catch {
      container.scrollTop = container.scrollHeight;
    }
  };

  // === Format URLs into a "Link" anchor only for plain text lines ===
  const formatText = (text) => {
    if (/<a\s+/i.test(text)) return text; // already contains HTML anchor -> skip
    const urlRegex =
      /\b((?:https?:\/\/|www\.)[^\s<>"']+[^\s<>"'.,;!?)]*)/gi;
    return text.replace(urlRegex, (url) => {
      let href = url.startsWith("http") ? url : "https://" + url;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">Link</a>`;
    });
  };

  // === Project & Certificate Lists (simple listing strings used by 'ls') ===
  const projectList = projects
    .map((p, i) => `${i + 1}. ${p.title}`)
    .join("\n");
  const certificateList = certificates
    .map((c, i) => `${i + 1}. ${c.title}`)
    .join("\n");

  // === Directory-aware help generator (called when help is requested) ===
  const getHelpText = () => {
  if (currentDir === "~") {
    return `Available commands:
──────────────────────────────
Navigation:
  cd projects
  cd certifications
  cd ..
  ls

Info:
  about, skills, experience, education, contact, resume, sudo, clear
──────────────────────────────`;
  } else if (currentDir === "projects") {
    return `/projects Commands:
──────────────────────────────
  ls                → List all projects
  show prj &lt;id&gt;     → Show project details
  open &lt;id&gt;         → Open project demo/github
  random            → Show random project
  stats             → Count total projects
  cd ..             → Return to home
──────────────────────────────`;
  } else if (currentDir === "certifications") {
    return `/certifications Commands:
──────────────────────────────
  ls                → List all certificates
  show cert &lt;id&gt;    → Show certificate details
  verify &lt;id&gt;       → Verify certificate link
  count             → Count total certificates
  cd ..             → Return to home
──────────────────────────────`;
  }
};


  // === Static command outputs (other info) ===
  const commands = {
    sudo: "Hello!👋 I'm Shigivahan Athithan — welcome to my interactive portfolio terminal.",
    about:
      "Hello!👋 I'm Shigivahan Athithan, a Full Stack Developer and Data Science Enthusiast.\n\n \n\nI enjoy designing intelligent, user-friendly applications and leveraging data to solve complex problems in real-world domains like healthcare, finance, and education.\n\n \n\nWith hands-on experience in React, Node.js, Python, TensorFlow, and SQL, I have built projects ranging from machine learning research published in IEEE/Scopus to hackathon-winning web apps.\n\n \n\nBeyond coding, I love exploring new technologies, contributing to open source, and constantly challenging myself to grow as a developer and analyst.\n\n",
    skills:
      "\nTechnical Skills\n- React\n- Next.js\n- Tailwind\n- CSS\n- Node.js\n- Express.js\n- MongoDB\n- Python\n- TensorFlow\n- Power BI\n- Framer Motion\n- Git\n- Figma\n",
    experience:
      "Experience\n- Built production-grade MERN apps integrating AI and analytics.\n- Created ML-powered dashboards for real-world use cases.",
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
    contact: `Get In Touch:\n\n \n\n
Email: <a href="mailto:shigivahanathithan@gmail.com" class="text-blue-400 underline">shigivahanathithan@gmail.com</a>\n
Phone: <span class="text-green-400">+91 93447-18155</span>\n
GitHub: <a href="https://github.com/ShigivahanA" target="_blank" class="text-blue-400 underline">github.com/ShigivahanA</a>\n
LinkedIn: <a href="https://linkedin.com/in/shigivahana" target="_blank" class="text-blue-400 underline">linkedin.com/in/shigivahana</a>\n\n \n\n
Feel free to reach out!`,

    clear: "clear",
  };

  // === Resume Download (keeps original behavior) ===
  const handleResumeDownload = () => {
    const resumeURL = "/Shigivahan_Resume.pdf";
    const promptLine = `<span class='text-blue-400'>shigi@portfolio:${currentDir}$</span> <span class='text-green-400'>resume</span>`;
    setLines((prev) => [...prev, promptLine, "Downloading resume.pdf ..."]);
    scrollToBottom(true);

    let countdown = 3;
    const countdownInterval = setInterval(() => {
      setLines((prev) => [...prev, `Downloading in ${countdown}...`]);
      countdown--;
      if (countdown === 0) {
        clearInterval(countdownInterval);
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
            const link = document.createElement("a");
            link.href = resumeURL;
            link.download = "Shigivahan_Resume.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            const size = (Math.random() * 1.5 + 1.5).toFixed(2);
            const dur = (Math.random() * 1.2 + 0.8).toFixed(2);
            setLines((prev) => [
              ...prev,
              `<span class='text-green-400'>Successfully downloaded resume.pdf (${size} MB in ${dur}s)</span>`,
            ]);
            setShowPrompt(true);
          }
        }, 100);
      }
    }, 800);
  };

  // === Command Handler ===
  const handleCommand = (cmd) => {
    const lower = cmd.toLowerCase().trim();

    // --- cd navigation ---
    if (lower.startsWith("cd ")) {
      const dir = lower.split(" ")[1];
      if (dir === "projects" || dir === "certifications") {
        if (currentDir !== "~") {
          // cannot cd directly while inside another directory
          setLines((prev) => [
            ...prev,
            `<span class='text-blue-400'>shigi@portfolio:${currentDir}$</span> cd ${dir}`,
            `<span class='text-red-400'>Directory not found in current path.</span>`,
          ]);
          setInput("");
          return;
        }
        // switch directory from home
        setCurrentDir(dir);
        onCommand?.(dir); // tell PreviewPanel to show multi view
        setLines((prev) => [
          ...prev,
          `<span class='text-green-400'>Switched to /${dir}</span>`,
        ]);
      } else if (dir === "..") {
        setCurrentDir("~");
        onCommand?.(null);
        setLines((prev) => [
          ...prev,
          `<span class='text-green-400'>Returned to home directory</span>`,
        ]);
      } else {
        setLines((prev) => [
          ...prev,
          `<span class='text-red-400'>Directory not found: ${dir}</span>`,
        ]);
      }
      setInput("");
      return;
    }

    // --- ls command: also triggers PreviewPanel to show all items ---
    if (lower === "ls") {
      if (currentDir === "projects") {
        onCommand?.("projects");
        startTyping(projectList);
      } else if (currentDir === "certifications") {
        onCommand?.("certifications");
        startTyping(certificateList);
      } else {
        startTyping("Directories:\n- projects\n- certifications");
      }
      return;
    }

    // --- help (directory-aware) ---
    if (lower === "help" || lower === "-help") {
      startTyping(getHelpText());
      return;
    }

    // --- project directory specific commands ---
    if (currentDir === "projects") {
      if (lower.startsWith("show prj ")) {
        const parts = lower.split(" ");
        const id = parseInt(parts[2], 10) - 1;
        const proj = projects[id];
        if (proj) {
          // Build HTML description (safe: content controlled by you)
          const desc = `Project: <b>${proj.title}</b>\nTech: ${proj.tech?.join(
            ", "
          )}\n\n${proj.description || "No description available."}\n\n${
            proj.demo
              ? `<a href="${proj.demo}" target="_blank" class="text-blue-400 underline">Live Demo</a>`
              : ""
          } ${
            proj.github
              ? `<a href="${proj.github}" target="_blank" class="text-blue-400 underline ml-2">GitHub</a>`
              : ""
          }`.trim();

          // Send single project to preview panel and print description
          onCommand?.({ type: "singleProject", data: proj });
          startTyping(desc);
        } else startTyping("Invalid project ID. Try show prj <id> (e.g. show prj 1)");
        return;
      }

      if (lower.startsWith("open ")) {
        const id = parseInt(lower.split(" ")[1], 10) - 1;
        const proj = projects[id];
        if (!proj) return startTyping("Invalid ID. Try 'ls' to view IDs.");
        window.open(proj.demo || proj.github || "#", "_blank");
        startTyping(`Opening ${proj.title}...`);
        return;
      }

      if (lower === "random") {
        const proj = projects[Math.floor(Math.random() * projects.length)];
        startTyping(`Random Project: ${proj.title}\n${proj.description || ""}`);
        return;
      }

      if (lower === "stats") {
        startTyping(`Total Projects: ${projects.length}`);
        return;
      }
    }

    // --- certifications directory specific commands ---
    if (currentDir === "certifications") {
      if (lower.startsWith("show cert ")) {
        const parts = lower.split(" ");
        const id = parseInt(parts[2], 10) - 1;
        const cert = certificates[id];
        if (cert) {
          const desc = `Certificate: <b>${cert.title}</b>\nIssuer: ${cert.issuer}\n\n${
            cert.link
              ? `<a href="${cert.link}" target="_blank" class="text-blue-400 underline">Verify Certificate</a>`
              : "No verification link available"
          }`.trim();

          onCommand?.({ type: "singleCert", data: cert });
          startTyping(desc);
        } else startTyping("Invalid certificate ID. Try show cert <id> (e.g. show cert 1)");
        return;
      }

      if (lower.startsWith("verify ")) {
        const id = parseInt(lower.split(" ")[1], 10) - 1;
        const cert = certificates[id];
        if (!cert || !cert.link) return startTyping("Invalid or missing verification link.");
        window.open(cert.link, "_blank");
        startTyping(`Verifying ${cert.title}...`);
        return;
      }

      if (lower === "count") {
        startTyping(`Total Certificates: ${certificates.length}`);
        return;
      }
    }

    // --- resume ---
    if (lower === "resume") {
      handleResumeDownload();
      return;
    }

    // --- clear ---
    if (lower === "clear") {
      setLines([]);
      onCommand?.(null);
      return;
    }

    // --- fallback: builtin commands or not found ---
    if (commands[lower]) {
      // Print prompt then start typing the static response
      const promptLine = `<span class='text-blue-400'>shigi@portfolio:${currentDir}$</span> <span class='text-green-400'>${cmd}</span>`;
      setLines((prev) => [...prev, promptLine]);
      startTyping(commands[lower]);
      return;
    }

    // default unknown command
    setLines((prev) => [
      ...prev,
      `<span class='text-blue-400'>shigi@portfolio:${currentDir}$</span> <span class='text-green-400'>${cmd}</span>`,
      `<span class='text-red-400'>Command not found: ${cmd}</span>`,
    ]);
  };

  // === Typing Animation ===
  // NOTE: we keep prompt visibility logic such that the prompt re-appears after typing completes.
  const startTyping = (text) => {
    const linesArray = text.split("\n");
    setFullLines(linesArray);
    setTypedText("");
    setCurrentLineIndex(0);
    setIsTyping(true);
    // do not hide prompt here — prompt is shown when !isTyping in the render
    scrollToBottom(true);
  };

  useEffect(() => {
    if (!isTyping || fullLines.length === 0) return;

    // start typing sound once
    if (!typingAudioRef.current) {
      try {
        const sound = new Audio("/sounds/typing.mp3");
        sound.volume = 0.45;
        sound.loop = true;
        sound.play().catch(() => {});
        typingAudioRef.current = sound;
      } catch {
        // ignore audio errors
      }
    }

    let line = fullLines[currentLineIndex];
    let index = 0;
    let current = "";

    if (typingRef.current) clearInterval(typingRef.current);

    typingRef.current = setInterval(() => {
      current += line.charAt(index) || "";
      setTypedText(current);
      requestAnimationFrame(() => scrollToBottom(false));
      index++;

      if (index >= line.length) {
        // finish this line
        clearInterval(typingRef.current);
        typingRef.current = null;

        // If the line already contains HTML anchors, push as-is; otherwise format URLs.
        const toPush = /<a\s+/i.test(current) ? current : formatText(current);

        setLines((prev) => [...prev, toPush]);

        // prepare next
        if (currentLineIndex < fullLines.length - 1) {
          // small delay between lines
          setTimeout(() => {
            setCurrentLineIndex((i) => i + 1);
            setTypedText("");
          }, 120);
        } else {
          // finished all lines
          if (typingAudioRef.current) {
            try {
              typingAudioRef.current.pause();
              typingAudioRef.current.currentTime = 0;
            } catch {}
            typingAudioRef.current = null;
          }
          setIsTyping(false);
          setTypedText("");
          setFullLines([]);
          // ensure prompt is shown after a tiny delay
          setTimeout(() => {
            setShowPrompt(true);
            scrollToBottom(true);
          }, 120);
        }
      }
    }, 18);

    return () => clearInterval(typingRef.current);
  }, [isTyping, currentLineIndex, fullLines]);

  // === Ctrl+C Interrupt ===
  useEffect(() => {
    const handleCtrlC = (e) => {
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        if (isTyping) {
          clearInterval(typingRef.current);
          typingRef.current = null;
          if (typingAudioRef.current) {
            try {
              typingAudioRef.current.pause();
              typingAudioRef.current.currentTime = 0;
            } catch {}
            typingAudioRef.current = null;
          }
          const pid = Math.floor(Math.random() * 4000) + 1000;
          setLines((prev) => [
            ...prev,
            "^C",
            `<span class='text-gray-500'>Terminated process (pid: ${pid})</span>`,
          ]);
          setIsTyping(false);
          setShowPrompt(true);
        }
      }
    };
    window.addEventListener("keydown", handleCtrlC);
    return () => window.removeEventListener("keydown", handleCtrlC);
  }, [isTyping]);

  // === History Navigation ===
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex =
        historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex =
        historyIndex === -1 || historyIndex === history.length - 1
          ? -1
          : historyIndex + 1;
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? "" : history[newIndex] || "");
    }
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [lines.length]);

  // === Render ===
  return (
    <motion.div
      ref={terminalRef}
      className="bg-black border border-green-700 p-3 md:p-4 rounded-lg w-full h-full overflow-y-auto shadow-inner 
                 text-[13.5px] sm:text-[14px] md:text-[16px]
                 overflow-x-hidden select-text
                 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      style={{ whiteSpace: "pre-wrap", WebkitOverflowScrolling: "touch" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {lines.map((line, i) => (
        <p
          key={i}
          className="text-white mb-1 leading-relaxed break-words whitespace-pre-wrap"
          style={{ wordWrap: "break-word", overflowWrap: "anywhere" }}
          dangerouslySetInnerHTML={{ __html: line }}
        />
      ))}

      {isTyping && typedText && (
        // typedText is shown as plain text while animating (prevents malformed partial HTML render)
        <p className="text-white mb-1 leading-relaxed break-words whitespace-pre-wrap">
          {typedText}
        </p>
      )}

      {/* Prompt / Input */}
      {showPrompt && !isTyping && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            // echo the prompt and command (consistent look)
            setLines((prev) => [
              ...prev,
              `<span class='text-blue-400'>shigi@portfolio:${currentDir}$</span> <span class='text-green-400'>${input.trim()}</span>`,
            ]);
            handleCommand(input.trim());
            setHistory((prev) => [...prev, input.trim()]);
            setInput("");
            setHistoryIndex(-1);
          }}
          onKeyDown={(e) => {
            handleKeyDown(e);
            // TAB autocomplete
            if (e.key === "Tab") {
              e.preventDefault();
              const candidateCommands = ["help", "ls", "cd", "show prj", "show cert", "open", "random", "stats", "verify", "count", "resume", "clear", ...Object.keys(commands)];
              const matches = candidateCommands.filter((cmd) =>
                cmd.startsWith(input.toLowerCase())
              );
              if (matches.length === 1) {
                setInput(matches[0]);
              } else if (matches.length > 1) {
                if (window.lastTabPress && Date.now() - window.lastTabPress < 500) {
                  setLines((prev) => [...prev, `\n${matches.join("   ")}\n`]);
                  scrollToBottom(true);
                }
                window.lastTabPress = Date.now();
              }
            }
          }}
          className="flex items-center"
        >
          <span className="text-blue-400 mr-2">shigi@portfolio:{currentDir}$</span>
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              className="bg-transparent flex-1 outline-none text-green-400 placeholder-gray-600"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setTabPressed(false);
              }}
              placeholder="Type a command..."
              autoFocus
              spellCheck={false}
            />
          </div>
        </form>
      )}
    </motion.div>
  );
}
