export enum ClientType {
  COMUM = "COMUM",
  DOW = "DOW",
  ARCELOR = "ARCELOR"
}

export interface Holiday {
  date: Date;
  name: string;
  isFixed: boolean;
  rawDateString?: string; // e.g. "01/01" or computed
}

export interface CalculationResult {
  baseDate: Date; // start date (today)
  daysOffset: number; // e.g. 60 days
  originalTargetDate: Date; // baseDate + daysOffset
  finalPaymentDate: Date; // adjusted target date
  clientType: ClientType;
  adjustments: AdjustmentNotice[];
}

export interface AdjustmentNotice {
  type: "info" | "warning" | "success";
  message: string;
  originalDayDescription?: string; // e.g. "Sábado", "Domingo", "Feriado"
  holidayName?: string;
}
