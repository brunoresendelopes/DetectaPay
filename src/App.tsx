import { useState, useEffect } from "react";
import { ClientType, CalculationResult } from "./types";
import { calculatePaymentDate, formatDateBR, toSafeNoonDate } from "./utils/dateUtils";
import ClientTypeSelector from "./components/ClientTypeSelector";
import ResultDisplay from "./components/ResultDisplay";
import HolidaySection from "./components/HolidaySection";
import { 
  Calendar, 
  Clock, 
  HelpCircle, 
  RefreshCw, 
  SlidersHorizontal, 
  Calculator, 
  Sparkles, 
  ArrowRight,
  BookmarkCheck,
  CheckCircle2,
  CalendarDays
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const today = new Date();
  
  // Format today's date for display
  const formattedToday = formatDateBR(today);
  
  // States
  const [startDateString, setStartDateString] = useState<string>(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  const [daysOffset, setDaysOffset] = useState<number>(60); // Default to 60 days
  const [clientType, setClientType] = useState<ClientType>(ClientType.COMUM);
  const [isCalculating, setIsCalculating] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Custom Holidays list persisted in localStorage
  const [customHolidays, setCustomHolidays] = useState<{ day: number; month: number; name: string }[]>(() => {
    try {
      const saved = localStorage.getItem("custom_holidays");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current calculation result
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Sync custom holidays to localStorage
  useEffect(() => {
    localStorage.setItem("custom_holidays", JSON.stringify(customHolidays));
    // Trigger recalculation if anything changes
    handleRecalculate(false);
  }, [customHolidays]);

  // Recalculate whenever inputs change for instant UX feel,
  // but we also have the explicit "Calcular" button to trigger transition effects
  useEffect(() => {
    handleRecalculate(false);
  }, [startDateString, daysOffset, clientType]);

  const handleRecalculate = (withAnimation: boolean = false) => {
    if (withAnimation) {
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        setSuccessToast("Cálculo processado com sucesso!");
        setTimeout(() => setSuccessToast(null), 3500);
      }, 500);
    }

    const parsedDate = new Date(startDateString + "T12:00:00");
    const safeDate = isNaN(parsedDate.getTime()) ? today : parsedDate;
    
    const computed = calculatePaymentDate(
      safeDate,
      daysOffset,
      clientType,
      customHolidays
    );
    setResult(computed);
  };

  const handleAddCustomHoliday = (newHoliday: { day: number; month: number; name: string }) => {
    setCustomHolidays(prev => [...prev, newHoliday]);
  };

  const handleRemoveCustomHoliday = (indexToRemove: number) => {
    setCustomHolidays(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleApplyPreset = (days: number) => {
    setDaysOffset(days);
  };

  const resetToDefaults = () => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setStartDateString(`${y}-${m}-${d}`);
    setDaysOffset(60);
    setClientType(ClientType.COMUM);
    setSuccessToast("Configurações resetadas com sucesso!");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col antialiased">
      {/* Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-slate-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        {/* Elegant Dark Header Section */}
        <header className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-slate-300">
              Detecta<span className="font-semibold text-white"> Pay</span> 
              <span className="text-slate-500 font-extralight ml-2 text-lg md:text-xl hidden sm:inline">| Calculadora de Datas de Pagamento</span>
            </h1>
          </div>
          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Data de Referência (Hoje)</span>
            <span className="text-xl md:text-2xl font-mono text-emerald-400">{formattedToday}</span>
          </div>
        </header>

        {/* Form and Results Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Inputs Formulation) - span 7 */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Calculation Controls block */}
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-slate-400" />
                  <h2 className="font-bold text-slate-200 text-base">Parâmetros de Entrada</h2>
                </div>
                <button
                  type="button"
                  title="Restaurar padrões"
                  onClick={resetToDefaults}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Restaurar</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Date Picker Block */}
                <div className="space-y-2">
                  <label htmlFor="start-date-input" className="text-xs font-semibold tracking-wide text-slate-400 uppercase flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>Data de Início</span>
                  </label>
                  
                  <div className="relative">
                    <input
                      id="start-date-input"
                      type="date"
                      value={startDateString}
                      onChange={(e) => setStartDateString(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-sm font-semibold focus:ring-1 focus:ring-emerald-500/55 focus:outline-none transition-all cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Padrão inicial definido como hoje. Altere caso deseje faturar datas retroativas ou simulações futuras.
                  </p>
                </div>

                {/* 2. Days Offset input */}
                <div className="space-y-2">
                  <label htmlFor="offset-days-input" className="text-xs font-semibold tracking-wide text-slate-400 uppercase flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>Prazo de Pagamento (Dias)</span>
                  </label>
                  
                  <div className="flex gap-2">
                    <input
                      id="offset-days-input"
                      type="number"
                      required
                      min="1"
                      max="1000"
                      value={daysOffset || ""}
                      onChange={(e) => setDaysOffset(Math.max(1, Number(e.target.value)))}
                      className="w-24 px-4 py-3 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white text-sm font-bold font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-center"
                    />
                    
                    {/* Compact presets */}
                    <div className="flex-1 grid grid-cols-3 gap-1.5">
                      {[30, 45, 60, 90, 120].slice(0, 3).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleApplyPreset(item)}
                          className={`py-1 rounded-lg border text-xs font-semibold hover:border-slate-600 transition-colors cursor-pointer ${
                            daysOffset === item
                              ? "bg-emerald-550 border-emerald-550 text-white font-extrabold bg-emerald-600"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {item}d
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Second row of presets */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[15, 45, 90, 120].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleApplyPreset(item)}
                        className={`py-1 rounded-lg border text-xs font-semibold hover:border-slate-600 transition-colors cursor-pointer ${
                          daysOffset === item
                            ? "bg-emerald-600 border-emerald-600 text-white font-extrabold"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {item} dias
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* 3. Client Rule Selection Grid Cards */}
              <div className="pt-2">
                <ClientTypeSelector
                  selectedType={clientType}
                  onChange={setClientType}
                />
              </div>

              {/* Main Submit calculator Button */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-4 items-center">
                <button
                  type="button"
                  id="btn-calculate"
                  disabled={isCalculating}
                  onClick={() => handleRecalculate(true)}
                  className="w-full sm:flex-1 py-3.5 px-6 bg-white hover:bg-emerald-400 text-slate-950 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-950/40 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processando Regras...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4" />
                      <span>Calcular Vencimento</span>
                    </>
                  )}
                </button>
                
                <div className="text-xs text-slate-500 py-1 font-medium flex items-center gap-1.5 self-center sm:self-auto">
                  <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                  <span>Mecanismo de ajuste em tempo real</span>
                </div>
              </div>
            </div>

            {/* Active Settings Info Block */}
            <div className="bg-slate-900/20 rounded-2xl p-5 border border-slate-850/80 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>Como esse cálculo de prazos funciona?</span>
              </h4>
              <div className="text-xs text-slate-400 leading-relaxed space-y-2">
                <p>
                  O motor de cálculo adiciona os dias corridos informados à data inicial. Em seguida, as regras de negócios específicas do cliente selecionado validam o resultado frente a dias úteis e faturamento padrão bancário:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-955 p-3 rounded-lg border border-slate-850 bg-slate-950/50">
                    <span className="font-bold text-emerald-400 block mb-0.5 text-[11px]">FINS DE SEMANA</span>
                    Caso o dia coincida com Sábado ou Domingo, o pagamento é transferido para o primeiro dia útil imediato (Segunda-feira).
                  </div>
                  <div className="bg-slate-955 p-3 rounded-lg border border-slate-850 bg-slate-950/50">
                    <span className="font-bold text-emerald-400 block mb-0.5 text-[11px]">FERIADOS NACIONAIS</span>
                    Recursos automáticos prorrogam o faturamento caso a semana coincida com recesso nacional ou datas cadastradas.
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Results & Holidays overview) - span 5 */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Calculation Result Board */}
            <ResultDisplay result={result} />

            {/* Holidays Schedule Widget (Inspectable & Editable) */}
            <HolidaySection
              customHolidays={customHolidays}
              onAddCustomHoliday={handleAddCustomHoliday}
              onRemoveCustomHoliday={handleRemoveCustomHoliday}
            />

          </div>

        </div>

      </main>

      {/* Footer footer-credits */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/80 py-8 px-6 text-[10px] uppercase tracking-[0.2em] text-slate-600">
        <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Detecta Pay Systems</p>
          <div className="flex gap-6 items-center">
            <span className="hover:text-emerald-500 transition-colors cursor-pointer">Termos de Uso</span>
            <span className="hover:text-emerald-500 transition-colors cursor-pointer">Privacidade</span>
            <span className="text-slate-800 uppercase normal-case font-mono tracking-normal">v2.4.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
