import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { projects, certificates } from "../assets/assets";

export default function PreviewPanel({ activeSection }) {
  const [previewItems, setPreviewItems] = useState([]);

  useEffect(() => {
    if (activeSection === "projects") {
      setPreviewItems(projects.slice(0, 4));
    } else if (activeSection === "certifications") {
      setPreviewItems(certificates.slice(0, 4));
    } else {
      setPreviewItems([]);
    }
  }, [activeSection]);

  return (
    <motion.div
      key={activeSection}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-black border border-green-700 rounded-lg p-4 w-full h-full flex flex-col justify-between text-green-400 shadow-[0_0_15px_rgba(0,255,100,0.1)]"
    >
      {/* === PROJECTS === */}
      {activeSection === "projects" && previewItems.length > 0 && (
        <>
          <p className="text-blue-400 text-lg mb-3 font-mono">
            🔧 Project Previews
          </p>
          <div className="grid grid-cols-2 gap-3">
            {previewItems.map((proj, idx) => {
              const link = proj.demo || proj.github || null;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="rounded-md border border-green-800 overflow-hidden shadow-lg hover:shadow-green-500/20 transition-all"
                >
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open ${proj.title}`}
                    >
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-24 object-cover hover:opacity-90 transition-opacity"
                      />
                    </a>
                  ) : (
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-24 object-cover"
                    />
                  )}
                  <div className="p-2 text-xs text-center">
                    <p className="font-bold text-green-300 truncate">{proj.title}</p>
                    <p className="text-[10px] text-green-500 truncate">
                      {proj.tech?.slice(0, 3).join(", ")}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="mt-3 text-green-500 text-sm italic">
            → Click a preview to open the project
          </p>
        </>
      )}

      {/* === CERTIFICATIONS === */}
      {activeSection === "certifications" && previewItems.length > 0 && (
        <>
          <p className="text-blue-400 text-lg mb-3 font-mono">
            🏅 Certificate Previews
          </p>
          <div className="grid grid-cols-2 gap-3">
            {previewItems.map((cert, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="rounded-md border border-green-800 overflow-hidden shadow-lg hover:shadow-green-500/20 transition-all"
              >
                {cert.link ? (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`View ${cert.title}`}
                  >
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-24 object-cover hover:opacity-90 transition-opacity"
                    />
                  </a>
                ) : (
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-24 object-cover"
                  />
                )}
                <div className="p-2 text-xs text-center">
                  <p className="font-bold text-green-300 truncate">{cert.title}</p>
                  <p className="text-[10px] text-green-500 truncate">
                    {cert.issuer}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-3 text-green-500 text-sm italic">
            → Tap a certificate to view verification
          </p>
        </>
      )}

      {/* === DEFAULT / IDLE === */}
      {previewItems.length === 0 && (
  <div className="flex flex-col justify-center items-center h-full text-center text-green-400 font-mono">
    <p className="text-lg">Terminal Standby...</p>
    <p className="text-green-300 text-sm mt-2">
      Waiting for your command to unlock data...
    </p>
    <p className="text-blue-400 mt-3 ">
      Try <span className="text-white">'projects'</span> or{' '}
      <span className="text-white">'certifications'</span> to deploy preview modules.
    </p>
  </div>
)}

    </motion.div>
  );
}
