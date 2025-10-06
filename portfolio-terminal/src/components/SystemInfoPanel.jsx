import { useEffect, useState } from "react";

export default function SystemInfoPanel() {
  const [time, setTime] = useState(new Date());
  const [cpu, setCpu] = useState(27);
  const [memory, setMemory] = useState(43);
  const [disk, setDisk] = useState(72);
  const [networkDown, setNetworkDown] = useState(2.5);
  const [networkUp, setNetworkUp] = useState(1.2);
  const [temp, setTemp] = useState(45.6);
  const [battery, setBattery] = useState(93.5);
  const [uptime, setUptime] = useState(0);
  const [log, setLog] = useState("Neural network core stable...");

  const statusMessages = [
    "Neural network core stable...",
    "Monitoring your digital environment...",
    "Analyzing network latency...",
    "AI assistant idle, awaiting commands...",
    "Thermal sensors normal...",
    "Data stream secure via quantum tunnel...",
    "System integrity check passed",
  ];

  // Update values randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setCpu((p) => Math.min(100, Math.max(0, p + (Math.random() * 6 - 3))));
      setMemory((p) => Math.min(100, Math.max(0, p + (Math.random() * 4 - 2))));
      setDisk((p) => Math.min(100, Math.max(0, p + (Math.random() * 2 - 1))));
      setNetworkDown((p) => Math.max(0, p + (Math.random() * 1 - 0.5)));
      setNetworkUp((p) => Math.max(0, p + (Math.random() * 1 - 0.5)));
      setTemp((p) => Math.min(90, Math.max(30, p + (Math.random() * 2 - 1))));
      setBattery((p) => Math.min(100, Math.max(0, p + (Math.random() * 0.5 - 0.25))));
      setUptime((p) => p + 1);

      // change status message occasionally
      if (Math.random() < 0.05) {
        setLog(statusMessages[Math.floor(Math.random() * statusMessages.length)]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (secs) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const Bar = ({ value }) => (
      <span
        className="inline-block h-[5px] bg-green-400"
        style={{ width: `${value}%` }}
      ></span>

  );

  return (
    <div className="bg-black border border-green-700 rounded-lg p-4 w-full h-full flex flex-col justify-between text-green-400 shadow-[0_0_15px_rgba(0,255,100,0.1)]">
      <div className="flex-1 flex flex-col justify-between">
        {/* HEADER */}
        <div>
          <p className="text-blue-400 text-lg mb-3 font-mono">
            System Monitor
          </p>

          {/* STATS */}
          <div className="space-y-1 text-sm md:text-base font-mono">
            <p>
              <span className="text-white">CPU:</span> <Bar value={cpu} /> {cpu.toFixed(1)}%
            </p>
            <p>
              <span className="text-white">Memory:</span> <Bar value={memory} /> {memory.toFixed(1)}%
            </p>
            <p>
             <span className="text-white">Disk:</span> <Bar value={disk} /> {disk.toFixed(1)}%
            </p>

            <p>
             <span className="text-white">Network ↓</span> {networkDown.toFixed(2)} <span className="text-white">Mbps ↑</span> {networkUp.toFixed(2)} Mbps
            </p>
            <p>
             <span className="text-white">Temp:</span> {temp.toFixed(1)}°C | Battery: {battery.toFixed(1)}%
            </p>
            <p>
             <span className="text-white">Uptime:</span> {formatUptime(uptime)}
            </p>
          </div>

          {/* STATUS MESSAGE */}
          <p className="mt-3 text-green-500 text-sm italic">
            → {log}
          </p>
        </div>

        {/* FOOTER */}
        <div className="mt-4 border-t border-green-800 pt-2 text-xs text-green-300 italic text-center">
          Monitoring your digital environment. All systems operational.

        </div>
      </div>
    </div>
  );
}
