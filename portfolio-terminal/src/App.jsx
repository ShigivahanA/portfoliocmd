import React, { useState, useEffect, useRef } from "react";
import SystemInfoPanel from "./components/SystemInfoPanel";
import Terminal from "./components/Terminal";
import Clock from "./components/Clock";
import { motion, AnimatePresence } from "framer-motion";


function LoadingScreen({ onDone }) {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const prompt = "shigi@portfolio:~$ ";
    const command = "open portfolio.cmd";
    const fullCommand = prompt + command;
    const timers = [];

    // Step 1: Type the initial command
    let i = 0;
    const typeSpeed = 60;
    const t1 = setInterval(() => {
      setLines([fullCommand.slice(0, i + 1)]);
      i++;
      if (i >= fullCommand.length) {
        clearInterval(t1);
        timers.push(setTimeout(() => startDirFlood(), 400));
      }
    }, typeSpeed);
    timers.push(t1);

    // Step 2: Simulate CMD `dir /s` flood effect
    const fakeDirs = Array.from({ length: 200 }, (_, idx) =>
      `C:\\Users\\Shigi\\Documents\\project\\file_${idx
        .toString()
        .padStart(3, "0")}.js`
    );

    function startDirFlood() {
      let count = 0;
      const floodSpeed = 15; // speed of adding lines
      const maxVisible = 60; // number of lines visible like a CMD window

      const flood = setInterval(() => {
        setLines((prev) => {
          // Generate new random lines in bulk
          const batch = Array.from({ length: 3 }, () => {
            const randomDir =
              fakeDirs[Math.floor(Math.random() * fakeDirs.length)];
            const fileSize = Math.floor(Math.random() * 5000 + 100);
            return `${randomDir}  ${fileSize} bytes`;
          });

          const newLines = [...prev, ...batch];

          // Keep only enough to fill full height (simulate scroll)
          if (newLines.length > maxVisible) newLines.splice(0, batch.length);
          return newLines;
        });

        count++;
        if (count > 180) {
          clearInterval(flood);
          timers.push(setTimeout(() => showOpeningMessage(), 800));
        }
      }, floodSpeed);
      timers.push(flood);
    }

    // Step 3: Finish loading — show “Opening portfolio...”
    function showOpeningMessage() {
      const opening = "Opening portfolio...";
      setLines([]);
      let j = 0;
      const openSpeed = 35;
      const t3 = setInterval(() => {
        setLines([opening.slice(0, j + 1)]);
        j++;
        if (j >= opening.length) {
          clearInterval(t3);
          timers.push(setTimeout(() => onDone && onDone(), 700));
        }
      }, openSpeed);
      timers.push(t3);
    }

    return () => timers.forEach((id) => clearTimeout(id));
  }, [onDone]);

  // Auto-scroll down as lines fill
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
      className="flex items-center justify-center h-screen w-full bg-black text-green-400 font-mono overflow-hidden"
    >
      {/* Centered full-size “terminal” container */}
      <div
        className="w-[90%] md:w-[80%] lg:w-[70%] h-[85%] bg-black border border-green-700 rounded-lg 
                   p-4 md:p-6 overflow-y-auto scrollbar-hide shadow-[0_0_25px_rgba(0,255,100,0.1)] flex flex-col justify-start"
      >
        <pre className="text-sm md:text-base leading-tight text-left whitespace-pre-wrap flex-1">
          {lines.join("\n")}
        </pre>
      </div>

      {/* Hide scrollbar globally */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
}


export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="h-screen bg-black text-green-400 font-mono overflow-hidden">
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loader" onDone={() => setLoading(false)} />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col h-full"
          >
            {/* === HEADER === */}
            <header className="border-b border-green-700 pb-2 px-4 flex flex-col items-start shrink-0 mt-3">
              <h1 className="text-2xl md:text-3xl font-bold text-green-500 leading-tight">
                Shigivahan Athithan
              </h1>
              <p className="text-blue-400 text-sm">Aspiring Data Engineer</p>
            </header>

            {/* === MAIN === */}
            <main className="flex-1 flex flex-col md:flex-row justify-between items-start gap-6 md:gap-10 border-x border-green-700 border-b rounded-b-lg p-4 md:p-6 overflow-hidden">
              {/* ID CARD (hidden on mobile) */}
              <div className="hidden md:flex flex-col items-center justify-center w-1/3 shrink-0">
                <SystemInfoPanel />
                 <p className="text-green-500 text-xs mt-3 text-center italic opacity-80">
Monitoring your digital environment. All systems operational.
  </p>
              </div>

              {/* TERMINAL */}
              <div className="w-full md:w-2/3 flex flex-col md:border-l border-green-700 md:pl-6 h-full">
                <div className="text-xs text-green-400 pb-1 mb-3 flex flex-wrap gap-x-2 shrink-0">
                  <span className="text-blue-400">help</span> |
                  <span>about</span> | <span>projects</span> | <span>skills</span> |
                  <span>experience</span> | <span>contact</span> | <span>education</span> | <span>resume</span> |
                  <span>certifications</span> | <span>sudo</span> | <span>clear</span>
                </div>
                <div className="flex-1 min-h-0">
                  <Terminal />
                </div>
              </div>
            </main>

            {/* === FOOTER === */}
            <footer className="border-t rounded-md border-green-700 px-4 py-2 flex justify-between items-center shrink-0">
              <p className="text-blue-400 text-xs">shigi@portfolio:~$</p>
              <Clock />
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
