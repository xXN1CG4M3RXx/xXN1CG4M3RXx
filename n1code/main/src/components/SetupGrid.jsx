import { Cpu, Keyboard, Monitor } from "lucide-react";
import SetupCard from "./SetupCard";

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
      <SetupCard title="PC Specs" icon={<Cpu className="h-5 w-5" />} items={gamingPc} delay={0} />
      <SetupCard title="Peripherals" icon={<Monitor className="h-5 w-5" />} items={peripherals} delay={90} />
      <SetupCard title="Development Setup" icon={<Keyboard className="h-5 w-5" />} items={development} delay={180} />
    </div>
  );
}
