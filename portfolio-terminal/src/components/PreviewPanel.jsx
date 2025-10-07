import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, certificates } from "../assets/assets";

export default function PreviewPanel({ activeSection }) {
  const [previewItems, setPreviewItems] = useState([]);
  const [viewMode, setViewMode] = useState("multi");
  const [isLoading, setIsLoading] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!activeSection) {
      setPreviewItems([]);
      setViewMode("multi");
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      if (activeSection === "projects") {
        setPreviewItems(projects.slice(0, 10));
        setViewMode("multi");
      } else if (activeSection === "certifications") {
        setPreviewItems(certificates.slice(0, 12));
        setViewMode("multi");
      } else if (typeof activeSection === "object") {
        if (activeSection.type === "singleProject") {
          setPreviewItems([activeSection.data]);
          setViewMode("single");
        } else if (activeSection.type === "singleCert") {
          setPreviewItems([activeSection.data]);
          setViewMode("single");
        }
      } else {
        setPreviewItems([]);
        setViewMode("multi");
      }

      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [activeSection]);

  // scroll to top on section change
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSection]);

  return (
    <motion.div
      ref={panelRef}
      key={activeSection?.type || activeSection}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-black border border-green-700 rounded-lg p-3 sm:p-4 w-full h-full overflow-y-auto shadow-inner
                 text-green-400 font-mono text-[11px] sm:text-[13px] md:text-[15px]
                 leading-relaxed [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      style={{ WebkitOverflowScrolling: "touch", whiteSpace: "pre-wrap" }}
    >
      {/* === HEADER === */}
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <p className="text-blue-400 font-mono text-base sm:text-lg">
          {activeSection === "projects"
            ? "Projects Directory"
            : activeSection === "certifications"
            ? "Certifications Directory"
            : activeSection?.type === "singleProject"
            ? "Project Details"
            : activeSection?.type === "singleCert"
            ? "Certificate Details"
            : "Portfolio Preview"}
        </p>
        {activeSection && (
          <span className="text-green-500 text-[10px] sm:text-xs italic">
            {activeSection?.type
              ? `/portfolio/${
                  activeSection.type === "singleProject"
                    ? "projects"
                    : "certifications"
                }`
              : `/portfolio/${activeSection}`}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* === LOADING === */}
        {isLoading && (
          <motion.div
            key="loading"
            className="flex flex-col items-center justify-center h-[60vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-green-400 text-xs sm:text-sm italic">Loading preview...</p>
          </motion.div>
        )}

        {/* === SINGLE ITEM VIEW === */}
        {!isLoading && viewMode === "single" && previewItems[0] && (
          <motion.div
            key="single"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="border border-green-800 bg-black/40 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4"
          >
            {activeSection?.type === "singleProject" && (
              <>
                <img
                  src={previewItems[0].image}
                  alt={previewItems[0].title}
                  className="w-full h-32 sm:h-40 object-cover rounded-md border border-green-900 mb-3 sm:mb-4"
                />
                <h3 className="text-green-300 text-base sm:text-lg font-bold mb-1">
                  {previewItems[0].title}
                </h3>
                <p className="text-[11px] sm:text-sm text-green-500 mb-2">
                  {previewItems[0].tech?.join(", ")}
                </p>
                <p className="text-green-400 text-[11px] sm:text-sm mb-3 sm:mb-4">
                  {previewItems[0].description || "No description available."}
                </p>
                <div className="flex gap-4 text-blue-400 text-[11px] sm:text-sm underline">
                  {previewItems[0].demo && (
                    <a href={previewItems[0].demo} target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </a>
                  )}
                  {previewItems[0].github && (
                    <a href={previewItems[0].github} target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  )}
                </div>
              </>
            )}

            {activeSection?.type === "singleCert" && (
              <div className="text-center">
                <img
                  src={previewItems[0].image}
                  alt={previewItems[0].title}
                  className="w-40 sm:w-48 h-28 sm:h-32 object-cover mx-auto border border-green-900 rounded-md mb-3"
                />
                <h3 className="text-green-300 text-base sm:text-lg font-bold mb-1">
                  {previewItems[0].title}
                </h3>
                <p className="text-[10px] sm:text-xs text-green-500 mb-2">
                  {previewItems[0].issuer}
                </p>
                {previewItems[0].link && (
                  <a
                    href={previewItems[0].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline text-[11px] sm:text-sm"
                  >
                    Verify Certificate
                  </a>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* === MULTI VIEW === */}
        {!isLoading && viewMode === "multi" && previewItems.length > 0 && (
          <motion.div
            key="multi"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`${
              activeSection === "projects"
                ? "flex flex-col gap-2 sm:gap-3"
                : "grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3"
            }`}
          >
            {activeSection === "projects"
              ? previewItems.map((proj, idx) => (
                  <div
                    key={idx}
                    className="group border border-green-800 bg-black/40 p-2 sm:p-3 rounded-md 
                              hover:border-green-500 hover:shadow-[0_0_15px_rgba(0,255,100,0.15)] 
                              transition-all overflow-hidden h-[70px] sm:h-[80px] flex items-center"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 w-full">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-md object-cover border border-green-900 flex-shrink-0"
                      />
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="font-bold text-green-300 text-[11px] sm:text-sm truncate">
                          {proj.title}
                        </p>
                        <p className="text-[10px] sm:text-xs text-green-500 truncate">
                          {proj.tech?.slice(0, 3).join(", ")}
                        </p>
                        {(proj.demo || proj.github) && (
                          <div className="mt-1 flex gap-2 text-[10px] sm:text-xs">
                            {proj.demo && (
                              <a
                                href={proj.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline truncate"
                              >
                                Live
                              </a>
                            )}
                            {proj.github && (
                              <a
                                href={proj.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline truncate"
                              >
                                Code
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              : previewItems.map((cert, idx) => (
                  <div
                    key={idx}
                    className="border border-green-800 rounded-lg overflow-hidden bg-black/40 
                               hover:shadow-[0_0_15px_rgba(0,255,100,0.15)]"
                  >
                    <a href={cert.link || "#"} target="_blank" rel="noopener noreferrer">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-20 sm:h-24 object-cover"
                      />
                    </a>
                    <div className="p-2 text-center">
                      <p className="font-bold text-green-300 text-[11px] sm:text-sm truncate">
                        {cert.title}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-green-500 truncate">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>
                ))}
          </motion.div>
        )}

        {/* === HELP SCREEN === */}
        {!activeSection && !isLoading && (
          <motion.div
            key="help"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="border border-green-800 bg-black/40 rounded-md p-3 sm:p-4 mt-2 text-green-400"
          >
            <p className="text-green-300 mb-2 font-bold text-sm sm:text-base flex items-center gap-2">
              AVAILABLE COMMANDS
            </p>
            <pre className="whitespace-pre-wrap text-[10px] sm:text-[12px] md:text-[14px] leading-relaxed">
{`Navigation
────────────────────────────
  cd projects         →  Enter projects
  cd certifications   →  Enter certifications
  cd ..               →  Go back home

/projects Commands
────────────────────────────
  ls                  →  List all projects
  show prj <id>       →  View project details
  open <id>           →  Open demo/github
  random              →  Show random project
  stats               →  Count total projects

/certifications Commands
────────────────────────────
  ls                  →  List certificates
  show cert <id>      →  View certificate details
  verify <id>         →  Verify certificate link
  count               →  Count certificates

Global Commands
────────────────────────────
  about, skills, experience, education,
  contact, resume, clear, help`}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
