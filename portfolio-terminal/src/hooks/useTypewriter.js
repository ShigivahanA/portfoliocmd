import { useState, useEffect } from "react";

export default function useTypewriter(text, speed = 50, onDone) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!text) return;
    let index = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(index));
      index++;
      if (index === text.length) {
        clearInterval(interval);
        if (onDone) onDone();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);

  return displayed;
}
