export interface CaseDTO {
  caseId: number;
  caseName: string;
  caseContact: string;
}

export interface CaseLineItemDataDTO {
  lineItemId: number;
  groupName: string | null;
  lineItemName: string;
  amount: number | null;
  unitAmount: number | null;
  perSqft: number | null;
  comments: string | null;
}

export interface CaseLineItemUpdateDTO {
  lineItemId: number;
  amount: number | null;
  comments: string | null;
}

export interface AdminSettingsDTO {
  id: number | null;
  numberOfUnits: number | null;
  totalSquareFeet: number | null;
}
