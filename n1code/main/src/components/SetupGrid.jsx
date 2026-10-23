import { Cpu, Keyboard, Monitor } from "lucide-react";
import SetupCard from "./SetupCard";
import Reveal from "./Reveal";

/**
 * Setup page body. `gamingPc` / `gamingPeripherals` / `development` are the
 * three lists the admin writes; `gaming` is accepted as a legacy alias.
 */
export default function SetupGrid({ setup = {}, className = "" }) {
  const gamingPc = setup.gamingPc || setup.gaming || [];
  const peripherals = setup.gamingPeripherals || [];
  const development = setup.development || [];

  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 ${className}`.trim()}>
      <Reveal className="h-full">
        <SetupCard title="PC Specs" icon={<Cpu className="h-5 w-5" />} items={gamingPc} />
      </Reveal>
      <Reveal delay={90} className="h-full">
        <SetupCard title="Peripherals" icon={<Monitor className="h-5 w-5" />} items={peripherals} />
      </Reveal>
      <Reveal delay={180} className="h-full">
        <SetupCard title="Development Setup" icon={<Keyboard className="h-5 w-5" />} items={development} />
      </Reveal>
    </div>
  );
}
