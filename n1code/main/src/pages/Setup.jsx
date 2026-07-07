import { useEffect, useState } from "react";
import SetupList from "../components/SetupList";
import { Monitor, Cpu, Keyboard } from "lucide-react";

export default function Setup() {
  const [setupData, setSetupData] = useState({
    gaming: [
      { name: "NVIDIA RTX 4080 Super", category: "GPU" },
      { name: "AMD Ryzen 7 7800X3D", category: "CPU" },
      { name: "32GB Corsair Vengeance DDR5", category: "RAM" },
      { name: "LG UltraGear 27\" 1440p 240Hz", category: "Monitor" },
      { name: "Wooting 60HE", category: "Keyboard" },
      { name: "Logitech G Pro X Superlight", category: "Mouse" }
    ],
    development: [
      { name: "MacBook Pro 16\" (M3 Max)", category: "Laptop" },
      { name: "Dell UltraSharp 32\" 4K", category: "Monitor" },
      { name: "Keychron Q1 Pro", category: "Keyboard" },
      { name: "Logitech MX Master 3S", category: "Mouse" }
    ]
  });

  // Mocking Firebase fetch
  useEffect(() => {
    // In the future: fetch from Firebase `setup` document/collection
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-24">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400 mb-6">
          <Monitor className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 font-display">
          My <span className="gradient-text">Command Center</span>
        </h1>
        <p className="max-w-2xl text-slate-400 text-lg font-light">
          The hardware I use to game, work, and build things.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SetupList 
          title="Gaming Rig" 
          icon={<Cpu className="w-6 h-6" />} 
          items={setupData.gaming} 
        />
        <SetupList 
          title="Development Setup" 
          icon={<Keyboard className="w-6 h-6" />} 
          items={setupData.development} 
        />
      </div>
    </div>
  );
}
