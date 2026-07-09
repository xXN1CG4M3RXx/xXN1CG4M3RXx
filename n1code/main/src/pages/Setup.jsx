import { useEffect, useState } from "react";
import SetupList from "../components/SetupList";
import { Monitor, Cpu, Keyboard } from "lucide-react";
import { db } from "../lib/firebase";
import { fetchCachedData } from "../lib/cache";

export default function Setup() {
  const [setupData, setSetupData] = useState({
    gamingPc: [],
    gamingPeripherals: [],
    development: []
  });

  // Fetch from Firebase
  useEffect(() => {
    const fetchSetup = async () => {
      try {
        const data = await fetchCachedData("setup");
        if (data) {
          setSetupData({
            gamingPc: data.gamingPc || data.gaming || [],
            gamingPeripherals: data.gamingPeripherals || [],
            development: data.development || []
          });
        }
      } catch (error) {
        console.error("Error fetching setup:", error);
      }
    };
    fetchSetup();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-24">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-16 h-16 rounded-2xl bg-sky-aqua-500/10 flex items-center justify-center border border-sky-aqua-500/20 text-sky-aqua-400 mb-6">
          <Monitor className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 font-display">
          My <span className="gradient-text">Command Center</span>
        </h1>
        <p className="max-w-2xl text-slate-400 text-lg font-light">
          The hardware I use to game, work, and build things.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <SetupList 
          title="PC Specs" 
          icon={<Cpu className="w-6 h-6" />} 
          items={setupData.gamingPc} 
        />
        <SetupList 
          title="Peripherals" 
          icon={<Monitor className="w-6 h-6" />} 
          items={setupData.gamingPeripherals} 
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
