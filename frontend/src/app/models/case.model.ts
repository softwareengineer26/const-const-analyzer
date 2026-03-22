export interface CaseDTO {
  caseId: number;
  caseName: string;
  caseContact: string;
}

export interface CaseLineItemDataDTO {
  lineItemId: number;
  groupName: string | null;
  lineItemName: string;
  est1Amount: number | null;
  est1UnitAmount: number | null;
  est1PerSqft: number | null;
  est1Comments: string | null;
  est2Amount: number | null;
  est2UnitAmount: number | null;
  est2PerSqft: number | null;
  est2Comments: string | null;
}

export interface CaseLineItemUpdateDTO {
  lineItemId: number;
  estimateId: number;
  amount: number | null;
  comments: string | null;
}

export interface AdminSettingsDTO {
  id: number | null;
  numberOfUnits: number | null;
  totalSquareFeet: number | null;
  expectedMonthlyRentEst1: number | null;
  expectedMonthlyRentEst2: number | null;
}
