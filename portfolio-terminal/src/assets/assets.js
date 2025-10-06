// === PROJECT IMAGES ===
import hecademy from "./hecademy.webp";
import glio from "./glio.webp";
import flav11 from "./flav11.png";
import dva from "./dva.png";
import mahal from "./mahal.webp";
import portfolio from "./portfolio.png";

// === CERTIFICATE IMAGES ===
import keras from "./keras.webp";
import oci from "./oci.webp";
import glioma from "./glioma.webp";
import streamlit from "./streamlit.webp";
import dataviz from "./dataviz.webp";
import canva from "./canva.webp";

// --- PROJECTS ---
export const projects = [
  {
    title: "Hecademy Personalized LMS",
    image: hecademy,
    tech: ["MongoDB", "Express", "React"],
    demo: "https://hecademy.vercel.app/",
    github: "https://github.com/ShigivahanA/testing-hecademy",
  },
  {
    title: "Glioma Grading with Deep Learning",
    image: glio,
    tech: ["ResNet50", "EfficientNet", "Streamlit"],
    github: "https://github.com/ShigivahanA/Gliomagrading",
  },
  {
    title: "Flavor Forecast ML App",
    image: flav11,
    tech: ["Machine Learning", "Streamlit"],
    github: "https://github.com/JaiAnandaKrishnaa/Flavour_Forecast",
  },
  {
    title: "Price Elasticity on Commodities Using ML",
    image: dva,
    tech: ["Python", "Data Analysis", "Regression"],
  },
  {
    title: "Marriage Mahal Website",
    image: mahal,
    tech: ["Next.js", "Tailwind"],
    demo: "https://iyyappanthirumanamandapam.vercel.app/",
  },
  {
    title: "Portfolio Website",
    image: portfolio,
    tech: ["React", "Vite", "Tailwind"],
    demo: "https://shigiportfolio.vercel.app/",
  },
];

// --- CERTIFICATES ---
export const certificates = [
  {
    title: "Creating Multi Task Models with Keras",
    image: keras,
    issuer: "Coursera",
    link: "https://coursera.org/verify/7958L3895XNL",
  },
  {
    title: "Oracle Cloud Infrastructure Foundations",
    image: oci,
    issuer: "Oracle",
    link: "https://www.credly.com/badges/oci-foundations", // example optional
  },
  {
    title: "Ensemble Learning for Glioma Grading",
    image: glioma,
    issuer: "IEEE INCET 2025",
    link: "https://ieeexplore.ieee.org/document/11140897",
  },
  {
    title: "Data Visualization using Plotly",
    image: dataviz,
    issuer: "Coursera",
    link: "https://coursera.org/verify/J8FKDYCDLW28",
  },
  {
    title: "Design a Pitch Deck with Canva",
    image: canva,
    issuer: "Coursera",
    link: "https://coursera.org/verify/Z7NUMGLN748E",
  },
  {
    title: "Build Data Apps with Streamlit",
    image: streamlit,
    issuer: "Coursera",
    link: "https://coursera.org/verify/9XBXPPGBDXYS",
  },
];

// ✅ Export for both PreviewPanel + Terminal
export const terminalData = {
  projects: projects.map((p) => ({
    title: p.title,
    demo: p.demo ? `[${p.demo}]` : null,
    github: p.github ? `[${p.github}]` : null,
  })),
  certificates: certificates.map((c) => ({
    title: `${c.title} (${c.issuer})`,
    link: c.link ? `[${c.link}]` : null,
  })),
};
