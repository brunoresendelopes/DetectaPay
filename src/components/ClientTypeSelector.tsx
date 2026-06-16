import { ClientType } from "../types";
import { UserCheck, Building2, Factory, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface ClientTypeSelectorProps {
  selectedType: ClientType;
  onChange: (type: ClientType) => void;
}

export default function ClientTypeSelector({ selectedType, onChange }: ClientTypeSelectorProps) {
  const options = [
    {
      id: ClientType.COMUM,
      title: "Cliente Comum",
      icon: UserCheck,
      color: "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-750",
      activeColor: "ring-1 ring-emerald-500/30 border-emerald-500 bg-emerald-500/5 text-white shadow-lg shadow-emerald-950/20",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
    },
    {
      id: ClientType.DOW,
      title: "Cliente DOW",
      icon: Building2,
      color: "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-750",
      activeColor: "ring-1 ring-sky-500/30 border-sky-500 bg-sky-500/5 text-white shadow-lg shadow-sky-950/20",
      badgeColor: "bg-sky-500/20 text-sky-400 border border-sky-500/30"
    },
    {
      id: ClientType.ARCELOR,
      title: "Cliente Arcelor Mittal",
      icon: Factory,
      color: "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-750",
      activeColor: "ring-1 ring-amber-500/30 border-amber-500 bg-amber-500/5 text-white shadow-lg shadow-amber-950/20",
      badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30"
    }
  ];

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold tracking-wide text-slate-450 uppercase" id="label-client-selection">
        Selecione o Tipo de Cliente <span className="text-emerald-500">*</span>
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup" aria-labelledby="label-client-selection">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = selectedType === option.id;
          
          return (
            <motion.button
              key={option.id}
              id={`client-card-${option.id.toLowerCase()}`}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(option.id)}
              className={`relative flex items-center text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isActive ? option.activeColor : "border-slate-800/80 bg-slate-950 hover:bg-slate-900 text-slate-400 shadow-xs"
              }`}
            >
              <div className="flex items-center gap-3 w-full pr-6">
                <div className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? option.badgeColor : "bg-slate-900 border border-slate-800 text-slate-500"}`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm tracking-tight ${isActive ? "text-white" : "text-slate-350"}`}>{option.title}</h3>
                </div>
              </div>

              {/* Active check indicator */}
              {isActive && (
                <div className="absolute top-1/2 -translate-y-1/2 right-4 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 animate-scaleIn" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
