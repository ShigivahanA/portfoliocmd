import { useEffect, useState } from "react";

export default function SystemInfoPanel() {
  const [time, setTime] = useState(new Date());
  const [cpu, setCpu] = useState(27);
  const [memory, setMemory] = useState(43);
  const [disk, setDisk] = useState(72);
  const [uptime, setUptime] = useState(0); // seconds since mount

  // Update system metrics randomly every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setCpu((prev) => Math.min(100, Math.max(0, prev + (Math.random() * 6 - 3))));
      setMemory((prev) => Math.min(100, Math.max(0, prev + (Math.random() * 4 - 2))));
      setDisk((prev) => Math.min(100, Math.max(0, prev + (Math.random() * 2 - 1))));
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Convert uptime seconds → hh:mm:ss
  const formatUptime = (secs) => {
    const h = Math.floor(secs / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="bg-black border border-green-700 rounded-lg p-4 w-full h-full flex flex-col justify-between text-green-400 shadow-[0_0_15px_rgba(0,255,100,0.1)]">
      <div>
        <p className="mb-2"><span className="text-blue-400">System Monitor</span></p>

        <div className="space-y-1 text-sm md:text-base">
          <p>
            CPU Usage:{" "}
            <span className="text-green-300">
              {cpu.toFixed(1)}%
            </span>
          </p>
          <p>
            Memory Usage:{" "}
            <span className="text-green-300">
              {memory.toFixed(1)}%
            </span>
          </p>
          <p>
            Disk Usage:{" "}
            <span className="text-green-300">
              {disk.toFixed(1)}%
            </span>
          </p>
          <p>
            Uptime:{" "}
            <span className="text-green-300">
              {formatUptime(uptime)}
            </span>
          </p>
        </div>
      </div>

      <p className="text-xs text-green-300 mt-4 border-t border-green-800 pt-2">
        Local Time: {time.toLocaleTimeString()}
      </p>
    </div>
  );
}
