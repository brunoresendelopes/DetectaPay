import { CalculationResult } from "../types";
import { formatDateBR, getDayOfWeekName } from "../utils/dateUtils";
import { Calendar, CalendarCheck, HelpCircle, ArrowRight, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface ResultDisplayProps {
  result: CalculationResult | null;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-900/20 border border-slate-800 border-dashed rounded-3xl min-h-[300px]">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-full text-slate-500 mb-3 animate-pulse">
          <Calendar className="w-8 h-8 stroke-[1.2] text-emerald-400" />
        </div>
        <h4 className="font-bold text-slate-300 text-sm uppercase tracking-wider">Aguardando Parâmetros</h4>
        <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
          Configure a data inicial e o prazo ideal de vencimento, e clique em "Calcular Vencimento" para processar as regras corporativas.
        </p>
      </div>
    );
  }

  const { baseDate, daysOffset, originalTargetDate, finalPaymentDate, adjustments } = result;

  const isAdjusted = originalTargetDate.getTime() !== finalPaymentDate.getTime();
  const originalDayName = getDayOfWeekName(originalTargetDate);
  const finalDayName = getDayOfWeekName(finalPaymentDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Card Header with client indicator */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 px-6 py-4 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-[10px] uppercase tracking-widest text-slate-300">Resultado do Faturamento</span>
          </div>
          <span className="px-3 py-1 bg-slate-900 text-emerald-400 border border-emerald-500/10 text-[10px] font-bold rounded-full uppercase tracking-wider">
            {daysOffset} dias corridos
          </span>
        </div>

        {/* Big Date Comparison Section */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          
          {/* Base & Original Estimated Date */}
          <div className="space-y-4 pb-4 md:pb-0">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block">De onde partimos</span>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                Data Inicial: <span className="font-mono text-slate-300 bg-slate-950 border border-slate-850 px-2 py-0.5 rounded text-[11px]">{formatDateBR(baseDate)}</span>
              </p>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 relative">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-semibold text-slate-400 absolute top-3 right-3">
                Projeção Rígida
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Vencimento Puro (+{daysOffset}d)</span>
              <p className="text-xl font-bold font-mono text-slate-400 mt-2 tracking-tight">
                {formatDateBR(originalTargetDate)}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Sendo um(a) <strong className="font-medium text-slate-450">{originalDayName}</strong>
              </span>
            </div>
          </div>

          {/* Final Adjusted Payment Date */}
          <div className="space-y-4 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 block">Data de Liquidação</span>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                Status: {isAdjusted ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold inline-block uppercase">
                    Ajustado pelas Regras
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold inline-block uppercase">
                    Sem Ajuste Necessário
                  </span>
                )}
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/20 relative">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] font-bold absolute top-3 right-3 animate-pulse uppercase">
                Definitiva
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">Data Oficial de Boletos</span>
              <p className="text-3xl font-extrabold font-mono text-white mt-1 tracking-tighter">
                {formatDateBR(finalPaymentDate)}
              </p>
              <span className="text-xs text-slate-300 mt-1 block font-semibold flex items-center gap-1">
                Dia de Depósito: <span className="text-emerald-400 font-bold">{finalDayName}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Flow visualizer */}
        <div className="bg-slate-950/40 px-6 py-4 border-t border-slate-800/85 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-400">Linha de Deslocamento Temporal:</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <span className="font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">{formatDateBR(baseDate)}</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-slate-500">+{daysOffset} Corrido</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">{formatDateBR(originalTargetDate)}</span>
            {isAdjusted && (
              <>
                <ArrowRight className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[9px]">Ajustes</span>
                <ArrowRight className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span className="font-mono font-bold text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/20">{formatDateBR(finalPaymentDate)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Audit Logs / Adjustments Notice Board */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
          <span>Relatório de Auditória & Conformidade</span>
          {adjustments.length > 0 && (
            <span className="font-mono bg-slate-900 border border-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full">
              {adjustments.length}
            </span>
          )}
        </h4>

        <div className="space-y-2.5">
          {adjustments.map((adj, index) => {
            let Icon = Info;
            let themeClass = "";
            
            if (adj.type === "warning") {
              Icon = AlertTriangle;
              themeClass = "bg-amber-950/10 border-amber-900/40 text-amber-400";
            } else if (adj.type === "success") {
              Icon = CheckCircle;
              themeClass = "bg-emerald-950/15 border-emerald-900/40 text-emerald-450";
            } else if (adj.type === "info") {
              Icon = Info;
              themeClass = "bg-sky-950/10 border-sky-900/40 text-sky-450";
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`flex gap-3 p-4 rounded-xl border text-xs leading-relaxed ${themeClass}`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                </div>
                <p className="font-medium">{adj.message}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
