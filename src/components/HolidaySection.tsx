import React, { useState } from "react";
import { getHolidaysForYear, formatDateBR } from "../utils/dateUtils";
import { Plus, Trash2, Calendar, Search, Info, Landmark, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HolidaySectionProps {
  customHolidays: { day: number; month: number; name: string }[];
  onAddCustomHoliday: (holiday: { day: number; month: number; name: string }) => void;
  onRemoveCustomHoliday: (index: number) => void;
}

export default function HolidaySection({
  customHolidays,
  onAddCustomHoliday,
  onRemoveCustomHoliday
}: HolidaySectionProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Custom Holiday Form State
  const [newHoliName, setNewHoliName] = useState("");
  const [newHoliDay, setNewHoliDay] = useState<number>(1);
  const [newHoliMonth, setNewHoliMonth] = useState<number>(0);

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Resolve all active holidays (fixed + mobile + custom) for chosen year
  const allHolidays = getHolidaysForYear(selectedYear, customHolidays);

  // Filter based on search query
  const filteredHolidays = allHolidays.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.rawDateString?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHoliName.trim()) return;

    onAddCustomHoliday({
      day: newHoliDay,
      month: newHoliMonth,
      name: newHoliName.trim()
    });

    // Reset Form
    setNewHoliName("");
    setNewHoliDay(1);
    setNewHoliMonth(0);
    setShowAddForm(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-950 border border-slate-800 text-emerald-400 rounded-xl">
            <Landmark className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">Calendário de Feriados</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Feriados brasileiros móveis e customizados aplicados.
            </p>
          </div>
        </div>

        {/* Year Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-850 p-1 rounded-xl text-xs font-semibold">
          {[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(yr => (
            <button
              key={yr}
              type="button"
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedYear === yr
                  ? "bg-slate-900 text-white border border-slate-800 shadow shadow-slate-900 text-[11px] font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Search + Custom Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar feriado ou data (Ex: Natal, 25/12)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800/80 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-all text-white placeholder-slate-600"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center justify-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
            showAddForm 
              ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-950/20" 
              : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white"
          }`}
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Cadastrar Feriado</span>
        </button>
      </div>

      {/* Expandable Custom Holiday Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateHoliday}
            className="overflow-hidden bg-slate-950/50 rounded-xl border border-slate-850 p-4 space-y-4"
          >
            <h4 className="font-bold text-[10px] uppercase tracking-wider text-emerald-450">
              Novo Feriado Regional ou Recesso Interno
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nome do Feriado</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Padroeira Municipal, Recesso Fim de Ano"
                  value={newHoliName}
                  onChange={(e) => setNewHoliName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-emerald-500 focus:outline-none transition-all placeholder-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Dia</label>
                <select
                  value={newHoliDay}
                  onChange={(e) => setNewHoliDay(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day} className="bg-slate-900 text-white">{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mês</label>
                <select
                  value={newHoliMonth}
                  onChange={(e) => setNewHoliMonth(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
                >
                  {months.map((m, idx) => (
                    <option key={idx} value={idx} className="bg-slate-900 text-white">{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 hover:text-slate-300 hover:bg-slate-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-white hover:bg-emerald-400 text-slate-950 rounded-lg text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
              >
                Inserir
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Holidays List Scroll Container */}
      <div className="max-h-[300px] overflow-y-auto border border-slate-850 rounded-xl divide-y divide-slate-850 bg-slate-950/30">
        {filteredHolidays.length === 0 ? (
          <div className="p-8 text-center text-slate-600 text-xs">
            Nenhum feriado correspondente à busca encontrado para <b>{selectedYear}</b>.
          </div>
        ) : (
          filteredHolidays.map((holiday, idx) => {
            const isCustom = holiday.name.includes("(Feriado Customizado)");
            const dateStr = formatDateBR(holiday.date);

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 hovering-tile transition-colors text-xs hover:bg-slate-950/40"
              >
                <div className="flex gap-2.5 items-center">
                  <div className={`p-1.5 rounded-lg ${isCustom ? "bg-amber-955 text-amber-400 border border-amber-500/20 bg-amber-500/5" : "bg-slate-900 text-slate-500"}`}>
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300">{holiday.name}</span>
                    <span className="text-[9px] text-slate-500 ml-1.5 bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded font-mono uppercase">
                      {holiday.isFixed ? "Fixo" : "Móvel"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                    {dateStr}
                  </span>
                  
                  {isCustom && (
                    <button
                      type="button"
                      title="Excluir feriado customizado"
                      onClick={() => {
                        // Find matching index in customHolidays
                        const customIndex = customHolidays.findIndex(
                          ch => ch.name + " (Feriado Customizado)" === holiday.name && 
                                ch.day === holiday.date.getDate() && 
                                ch.month === holiday.date.getMonth()
                        );
                        if (customIndex !== -1) {
                          onRemoveCustomHoliday(customIndex);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-950/30 p-1.5 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-450 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
        <Info className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
        <p className="leading-normal">
          Feriados adicionados são mantidos em cache local do navegador. Feriados astronômicos (móveis) como <b>Carnaval</b>, <b>Quaresma</b> e <b>Corpus Christi</b> são detectados de forma dinâmica para cada ano escolhido.
        </p>
      </div>
    </div>
  );
}
