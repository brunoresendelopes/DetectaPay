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
      description: "Regra básica de prazo corrido.",
      rules: [
        "Vence em data atual + dias informado.",
        "Caindo em Fim de Semana → Próxima Segunda-feira.",
        "Caindo em Feriado Nacional → Próximo dia útil."
      ],
      color: "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-750",
      activeColor: "ring-1 ring-emerald-500/30 border-emerald-500 bg-emerald-500/5 text-white shadow-lg shadow-emerald-950/20",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
    },
    {
      id: ClientType.DOW,
      title: "Cliente DOW",
      icon: Building2,
      description: "Ciclo de pagamentos focado em dia de semana fixo.",
      rules: [
        "A DOW só realiza pagamentos às quartas-feiras.",
        "Ajusta o faturamento para a próxima quarta-feira disponível.",
        "Se a quarta for feriado nacional → Próxima quarta-feira."
      ],
      color: "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-750",
      activeColor: "ring-1 ring-sky-500/30 border-sky-500 bg-sky-500/5 text-white shadow-lg shadow-sky-950/20",
      badgeColor: "bg-sky-500/20 text-sky-400 border border-sky-500/30"
    },
    {
      id: ClientType.ARCELOR,
      title: "Cliente Arcelor Mittal",
      icon: Factory,
      description: "Ciclo de pagamentos em dias fixos do mês.",
      rules: [
        "Apenas paga nos dias 1, 8, 15 e 22 de cada mês.",
        "Ajusta para o próximo disponível. Se passar do 22, vai para o dia 1 do mês seguinte.",
        "Se cair em fim de semana ou feriado → Próximo dia útil."
      ],
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
              className={`relative flex flex-col text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isActive ? option.activeColor : "border-slate-800/80 bg-slate-950 hover:bg-slate-900 text-slate-400 shadow-xs"
              }`}
            >
              {/* Active check indicator */}
              {isActive && (
                <div className="absolute top-4 right-4 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 animate-scaleIn" />
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl flex items-center justify-center ${isActive ? option.badgeColor : "bg-slate-900 border border-slate-800 text-slate-500"}`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm tracking-tight ${isActive ? "text-white" : "text-slate-350"}`}>{option.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{option.description}</p>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-dashed border-slate-900 space-y-1.5 w-full">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Regras aplicadas:</span>
                {option.rules.map((rule, idx) => (
                  <div key={idx} className="flex gap-1.5 items-start text-xs leading-normal">
                    <span className="text-slate-600 mt-1 select-none">•</span>
                    <span className={isActive ? "text-slate-300" : "text-slate-500"}>{rule}</span>
                  </div>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
