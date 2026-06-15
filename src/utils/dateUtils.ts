import { ClientType, Holiday, CalculationResult, AdjustmentNotice } from "../types";

/**
 * Calculates Easter Sunday for a given year using the Meeus/Jones/Butcher algorithm.
 * Returns a Date object set to noon to prevent issues with daylight saving time.
 */
export function getEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

/**
 * Returns a list of Brazilian national holidays for a given year.
 * Easily editable to add/remove custom holidays.
 */
export function getHolidaysForYear(year: number, customHolidays: { day: number; month: number; name: string }[] = []): Holiday[] {
  // Traditional Brazilian national holidays (fixed)
  const fixedHolidays = [
    { month: 0, day: 1, name: "Confraternização Universal (Ano Novo)" }, // 01/01
    { month: 3, day: 21, name: "Tiradentes" },                            // 21/04
    { month: 4, day: 1, name: "Dia do Trabalhador" },                     // 01/05
    { month: 8, day: 7, name: "Independência do Brasil" },                // 07/09
    { month: 9, day: 12, name: "Nossa Senhora Aparecida" },                // 12/10
    { month: 10, day: 2, name: "Finados" },                               // 02/11
    { month: 10, day: 15, name: "Proclamação da República" },             // 15/11
    { month: 10, day: 20, name: "Dia Nacional de Zumbi e da Consciência Negra" }, // 20/11
    { month: 11, day: 25, name: "Natal" }                                 // 25/12
  ];

  const list: Holiday[] = [];

  // Add standard fixed holidays
  for (const h of fixedHolidays) {
    list.push({
      date: new Date(year, h.month, h.day, 12, 0, 0, 0),
      name: h.name,
      isFixed: true,
      rawDateString: `${String(h.day).padStart(2, '0')}/${String(h.month + 1).padStart(2, '0')}`
    });
  }

  // Calculate and add standard mobile holidays relative to Easter
  const easter = getEaster(year);

  // Sexta-feira Santa (Easter - 2 days)
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  list.push({
    date: goodFriday,
    name: "Sexta-feira Santa (Paixão de Cristo)",
    isFixed: false,
    rawDateString: `Móvel (Sexta-feira antes da Páscoa)`
  });

  // Carnaval Terça-feira (Easter - 47 days)
  const carnavalTue = new Date(easter);
  carnavalTue.setDate(easter.getDate() - 47);
  list.push({
    date: carnavalTue,
    name: "Carnaval (Terça-feira)",
    isFixed: false,
    rawDateString: `Móvel`
  });

  // Carnaval Segunda-feira (Easter - 48 days) - Often recognized as a holiday
  const carnavalMon = new Date(easter);
  carnavalMon.setDate(easter.getDate() - 48);
  list.push({
    date: carnavalMon,
    name: "Carnaval (Segunda-feira)",
    isFixed: false,
    rawDateString: `Móvel`
  });

  // Corpus Christi (Easter + 60 days)
  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);
  list.push({
    date: corpusChristi,
    name: "Corpus Christi",
    isFixed: false,
    rawDateString: `Móvel (Quinta-feira)`
  });

  // Add user-defined custom holidays
  for (const custom of customHolidays) {
    list.push({
      date: new Date(year, custom.month, custom.day, 12, 0, 0, 0),
      name: custom.name + " (Feriado Customizado)",
      isFixed: true,
      rawDateString: `${String(custom.day).padStart(2, '0')}/${String(custom.month + 1).padStart(2, '0')}`
    });
  }

  // Sort them chronologically
  return list.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Checks if two dates are on the exact same calendar day (ignores hours/minutes).
 */
export function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

/**
 * Finds if a specific date is a holiday and returns information about it.
 */
export function getHolidayForDate(
  date: Date,
  customHolidays: { day: number; month: number; name: string }[] = []
): Holiday | null {
  const year = date.getFullYear();
  const holidays = getHolidaysForYear(year, customHolidays);
  const found = holidays.find(h => isSameDay(h.date, date));
  return found || null;
}

/**
 * Checks if a date falls on a weekend (Saturday = 6 or Sunday = 0)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Formats a given Date to DD/MM/YYYY format.
 */
export function formatDateBR(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

/**
 * Returns the name of the day of the week in Portuguese.
 */
export function getDayOfWeekName(date: Date): string {
  const days = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
  ];
  return days[date.getDay()];
}

/**
 * Standardizes a date to noon local time to safeguard against timezone shifting.
 */
export function toSafeNoonDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
}

/**
 * Evaluates payment rules based on client type, adding clear notices for any adjustments applied.
 */
export function calculatePaymentDate(
  startFrom: Date,
  daysOffset: number,
  clientType: ClientType,
  customHolidays: { day: number; month: number; name: string }[] = []
): CalculationResult {
  const baseDate = toSafeNoonDate(startFrom);
  
  // 1. Calculate original target date (without adjustments)
  const originalTargetDate = new Date(baseDate);
  originalTargetDate.setDate(originalTargetDate.getDate() + daysOffset);
  
  let finalPaymentDate = new Date(originalTargetDate);
  const adjustments: AdjustmentNotice[] = [];

  if (clientType === ClientType.COMUM) {
    // CLIENTE COMUM:
    // Move to next business day if week-end or holiday.
    let safetyCounter = 0;
    while (safetyCounter < 30) {
      safetyCounter++;
      const dayOfWeek = finalPaymentDate.getDay();
      const holiday = getHolidayForDate(finalPaymentDate, customHolidays);
      const formattedCurrent = formatDateBR(finalPaymentDate);

      if (dayOfWeek === 6) { // Saturday
        adjustments.push({
          type: "warning",
          message: `A data original caiu em um Sábado (${formattedCurrent}). Prorrogando para segunda-feira.`
        });
        finalPaymentDate.setDate(finalPaymentDate.getDate() + 2);
      } else if (dayOfWeek === 0) { // Sunday
        adjustments.push({
          type: "warning",
          message: `A data original caiu em um Domingo (${formattedCurrent}). Prorrogando para segunda-feira.`
        });
        finalPaymentDate.setDate(finalPaymentDate.getDate() + 1);
      } else if (holiday) {
        adjustments.push({
          type: "warning",
          message: `A data caiu no feriado "${holiday.name}" (${formattedCurrent}). Deslocando para o próximo dia útil.`
        });
        finalPaymentDate.setDate(finalPaymentDate.getDate() + 1);
      } else {
        // Valid business day
        break;
      }
    }
    
    if (adjustments.length === 0) {
      adjustments.push({
        type: "success",
        message: "Data em dia útil e sem feriados. Nenhuma alteração foi necessária."
      });
    }

  } else if (clientType === ClientType.DOW) {
    // CLIENTE DOW:
    // DOW only pays on Wednesdays.
    // Calculate difference to next Wednesday (day 3 of week)
    const currentDoW = finalPaymentDate.getDay();
    // (target_day - current_day + 7) % 7
    const daysToWednesday = (3 - currentDoW + 7) % 7;
    
    const formattedPreDOW = formatDateBR(finalPaymentDate);
    if (daysToWednesday > 0) {
      finalPaymentDate.setDate(finalPaymentDate.getDate() + daysToWednesday);
      adjustments.push({
        type: "info",
        message: `Cliente DOW só realiza pagamentos às quartas-feiras. Ajustando data de ${formattedPreDOW} para a próxima quarta-feira (${formatDateBR(finalPaymentDate)}).`
      });
    } else {
      adjustments.push({
        type: "success",
        message: `A data calculada caiu exatamente em uma quarta-feira (${formatDateBR(finalPaymentDate)}), que é o dia padrão de pagamento DOW.`
      });
    }

    // Check if that Wednesday itself is a holiday. If yes, move to next Wednesday!
    let safetyCounter = 0;
    while (safetyCounter < 10) {
      safetyCounter++;
      const holiday = getHolidayForDate(finalPaymentDate, customHolidays);
      if (holiday) {
        const preHolidayFormatted = formatDateBR(finalPaymentDate);
        finalPaymentDate.setDate(finalPaymentDate.getDate() + 7);
        adjustments.push({
          type: "warning",
          message: `A quarta-feira de pagamento (${preHolidayFormatted}) coincide com o feriado "${holiday.name}". Prorrogando para a quarta-feira seguinte (${formatDateBR(finalPaymentDate)}).`
        });
      } else {
        break;
      }
    }

  } else if (clientType === ClientType.ARCELOR) {
    // CLIENTE ARCELOR MITTAL:
    // Only pays on days 1, 8, 15, and 22.
    const initialDay = finalPaymentDate.getDate();
    let targetDay = 1;
    let monthShift = 0;

    if (initialDay === 1) {
      targetDay = 1;
    } else if (initialDay <= 8) {
      targetDay = 8;
    } else if (initialDay <= 15) {
      targetDay = 15;
    } else if (initialDay <= 22) {
      targetDay = 22;
    } else {
      targetDay = 1;
      monthShift = 1;
    }

    const formattedPreArcelor = formatDateBR(finalPaymentDate);
    
    if (monthShift > 0) {
      finalPaymentDate.setMonth(finalPaymentDate.getMonth() + 1);
    }
    finalPaymentDate.setDate(targetDay);

    const formattedPostArcelor = formatDateBR(finalPaymentDate);
    if (formattedPreArcelor !== formattedPostArcelor) {
      adjustments.push({
        type: "info",
        message: `Cliente Arcelor Mittal só paga nos dias 1, 8, 15 e 22. Ajustando de ${formattedPreArcelor} para o dia disponível de pagamento mais próximo (${formattedPostArcelor}).`
      });
    } else {
      adjustments.push({
        type: "success",
        message: `A data coincide perfeitamente com um dos dias de ciclo de faturamento Arcelor Mittal (${formattedPostArcelor}).`
      });
    }

    // Now if that day lands on weekend or holiday, shift forward using business days rules
    let safetyCounter = 0;
    while (safetyCounter < 30) {
      safetyCounter++;
      const dayOfWeek = finalPaymentDate.getDay();
      const holiday = getHolidayForDate(finalPaymentDate, customHolidays);
      const formattedCurrent = formatDateBR(finalPaymentDate);

      if (dayOfWeek === 6) { // Saturday
        finalPaymentDate.setDate(finalPaymentDate.getDate() + 2);
        adjustments.push({
          type: "warning",
          message: `O dia de pagamento (${formattedCurrent}) caiu em um Sábado. Prorrogando para o próximo dia útil (${formatDateBR(finalPaymentDate)}).`
        });
      } else if (dayOfWeek === 0) { // Sunday
        finalPaymentDate.setDate(finalPaymentDate.getDate() + 1);
        adjustments.push({
          type: "warning",
          message: `O dia de pagamento (${formattedCurrent}) caiu em um Domingo. Prorrogando para o próximo dia útil (${formatDateBR(finalPaymentDate)}).`
        });
      } else if (holiday) {
        finalPaymentDate.setDate(finalPaymentDate.getDate() + 1);
        adjustments.push({
          type: "warning",
          message: `O dia de pagamento coincidiu com o feriado "${holiday.name}" (${formattedCurrent}). Prorrogando para o próximo dia útil (${formatDateBR(finalPaymentDate)}).`
        });
      } else {
        break;
      }
    }
  }

  return {
    baseDate,
    daysOffset,
    originalTargetDate,
    finalPaymentDate,
    clientType,
    adjustments
  };
}
