import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, ColGroupDef, GridApi, GridReadyEvent, CellValueChangedEvent } from 'ag-grid-community';
import { CaseService } from '../../services/case.service';
import { CaseDTO, CaseLineItemDataDTO, CaseLineItemUpdateDTO, AdminSettingsDTO } from '../../models/case.model';

interface GridRowData {
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
  isGroupRow?: boolean;
  isRentRow?: boolean;
}

interface AggregatedRow {
  groupName: string;
  est1Amount: number | null;
  est1UnitAmount: number | null;
  est1PerSqft: number | null;
  est2Amount: number | null;
  est2UnitAmount: number | null;
  est2PerSqft: number | null;
}

const TAB_GROUPS: { [key: string]: string[] } = {
  'Tab 1': ['Gross Rent', 'Foundation Phase', 'External Structure'],
  'Tab 2': ['Internal Construction (base)', 'Internal Construction (Utilities)', 'Fixtures'],
  'Tab 3': ['Fees and Taxes', 'Workers']
};

const TAB_LABELS: string[] = ['Tab 1', 'Tab 2', 'Tab 3', 'Aggregated'];

@Component({
  selector: 'app-cost-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule],
  templateUrl: './cost-grid.component.html',
  styleUrls: ['./cost-grid.component.css']
})
export class CostGridComponent implements OnInit {

  private gridApi!: GridApi;

  cases: CaseDTO[] = [];
  selectedCaseId: number | null = null;
  allLineItems: CaseLineItemDataDTO[] = [];
  rowData: GridRowData[] = [];
  aggregatedData: AggregatedRow[] = [];
  pendingChanges: Map<string, CaseLineItemUpdateDTO> = new Map();
  adminSettings: AdminSettingsDTO | null = null;
  showEstimate2 = false;
  activeTab = 0;
  tabLabels = TAB_LABELS;

  columnDefs: (ColDef | ColGroupDef)[] = [];
  aggregatedColumnDefs: (ColDef | ColGroupDef)[] = [];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: false
  };

  constructor(private caseService: CaseService) {}

  ngOnInit(): void {
    this.buildColumnDefs();
    this.buildAggregatedColumnDefs();
    this.loadAdminSettings();
  }

  buildColumnDefs(): void {
    const lineItemCol: ColDef = {
      headerName: 'LineItems',
      field: 'lineItemName',
      editable: false,
      width: 300,
      minWidth: 220,
      pinned: 'left',
      cellStyle: (params): Record<string, string> => {
        if (params.data?.isGroupRow) {
          return { fontWeight: 'bold', backgroundColor: '#e8f0fe', fontSize: '14px' };
        }
        return { paddingLeft: '30px' };
      }
    };

    const est1Group: ColGroupDef = {
      headerName: 'Estimate# 1',
      children: [
        this.buildAmountCol('est1Amount'),
        this.buildReadOnlyNumCol('$/Unit', 'est1UnitAmount'),
        this.buildReadOnlyNumCol('$/Sq.Ft.', 'est1PerSqft'),
        this.buildCommentsCol('est1Comments')
      ]
    };

    const est2Group: ColGroupDef = {
      headerName: 'Estimate# 2',
      children: [
        this.buildAmountCol('est2Amount'),
        this.buildReadOnlyNumCol('$/Unit', 'est2UnitAmount'),
        this.buildReadOnlyNumCol('$/Sq.Ft.', 'est2PerSqft'),
        this.buildCommentsCol('est2Comments')
      ]
    };

    this.columnDefs = [lineItemCol, est1Group];
    if (this.showEstimate2) {
      this.columnDefs.push(est2Group);
    }
  }

  buildAggregatedColumnDefs(): void {
    const groupCol: ColDef = {
      headerName: 'Group',
      field: 'groupName',
      editable: false,
      width: 300,
      minWidth: 220,
      pinned: 'left',
      cellStyle: (): Record<string, string> => ({ fontWeight: 'bold' })
    };

    const est1AggGroup: ColGroupDef = {
      headerName: 'Estimate# 1',
      children: [
        this.buildAggNumCol('$ Amount', 'est1Amount'),
        this.buildAggNumCol('$/Unit', 'est1UnitAmount'),
        this.buildAggNumCol('$/Sq.Ft.', 'est1PerSqft')
      ]
    };

    const est2AggGroup: ColGroupDef = {
      headerName: 'Estimate# 2',
      children: [
        this.buildAggNumCol('$ Amount', 'est2Amount'),
        this.buildAggNumCol('$/Unit', 'est2UnitAmount'),
        this.buildAggNumCol('$/Sq.Ft.', 'est2PerSqft')
      ]
    };

    this.aggregatedColumnDefs = [groupCol, est1AggGroup];
    if (this.showEstimate2) {
      this.aggregatedColumnDefs.push(est2AggGroup);
    }
  }

  private buildAmountCol(field: string): ColDef {
    return {
      headerName: '$ Amount',
      field,
      editable: (params) => {
        if (params.data?.isGroupRow) return false;
        if (params.data?.isRentRow) return false;
        return true;
      },
      width: 150,
      minWidth: 120,
      type: 'numericColumn',
      valueFormatter: (params) => {
        if (params.value == null) return '';
        return Number(params.value).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      },
      valueSetter: (params) => {
        if (params.data?.isGroupRow || params.data?.isRentRow) return false;
        const newValue = params.newValue === '' || params.newValue == null ? null : Number(params.newValue);
        if (newValue !== null && (isNaN(newValue) || newValue > 10000000)) {
          return false;
        }
        params.data[field] = newValue;
        return true;
      },
      cellStyle: (params): Record<string, string> => {
        if (params.data?.isGroupRow) {
          return { fontWeight: 'bold', backgroundColor: '#e8f0fe' };
        }
        if (params.data?.isRentRow) {
          return { backgroundColor: '#f0f0f0', color: '#666' };
        }
        return {};
      }
    };
  }

  private buildReadOnlyNumCol(headerName: string, field: string): ColDef {
    return {
      headerName,
      field,
      editable: false,
      width: 130,
      minWidth: 100,
      type: 'numericColumn',
      valueFormatter: (params) => {
        if (params.value == null) return '';
        return Number(params.value).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      },
      cellStyle: (params) => {
        const base: Record<string, string> = { backgroundColor: '#f5f5f5', color: '#666' };
        if (params.data?.isGroupRow) {
          base['fontWeight'] = 'bold';
          base['backgroundColor'] = '#e8f0fe';
        }
        return base;
      }
    };
  }

  private buildCommentsCol(field: string): ColDef {
    return {
      headerName: 'Comments',
      field,
      editable: (params) => !params.data?.isGroupRow && !params.data?.isRentRow,
      width: 200,
      minWidth: 150,
      valueSetter: (params) => {
        if (params.data?.isGroupRow || params.data?.isRentRow) return false;
        const newValue = params.newValue || '';
        if (newValue.length > 300) return false;
        params.data[field] = newValue;
        return true;
      },
      cellStyle: (params): Record<string, string> => {
        if (params.data?.isGroupRow) {
          return { backgroundColor: '#e8f0fe' };
        }
        return {};
      }
    };
  }

  private buildAggNumCol(headerName: string, field: string): ColDef {
    return {
      headerName,
      field,
      editable: false,
      width: 150,
      minWidth: 120,
      type: 'numericColumn',
      valueFormatter: (params) => {
        if (params.value == null) return '';
        return Number(params.value).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      },
      cellStyle: (): Record<string, string> => ({ fontWeight: 'bold' })
    };
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  loadAdminSettings(): void {
    this.caseService.getAllAdminSettings().subscribe({
      next: (settings) => {
        if (settings.length > 0) {
          this.adminSettings = settings[0];
        }
        this.loadCases();
      },
      error: (err) => {
        console.error('Error loading admin settings:', err);
        this.loadCases();
      }
    });
  }

  loadCases(): void {
    this.caseService.getAllCases().subscribe({
      next: (cases) => {
        this.cases = cases;
        if (cases.length > 0) {
          this.selectedCaseId = cases[0].caseId;
          this.loadCaseData();
        }
      },
      error: (err) => {
        console.error('Error loading cases:', err);
      }
    });
  }

  loadCaseData(): void {
    if (this.selectedCaseId == null) return;

    const numUnits = this.adminSettings?.numberOfUnits;
    const totalSqFt = this.adminSettings?.totalSquareFeet;

    this.caseService.getLineItemData(this.selectedCaseId, numUnits, totalSqFt).subscribe({
      next: (data) => {
        this.allLineItems = data;
        this.applyGrossRentCalculation();
        this.refreshTabData();
        this.pendingChanges.clear();
      },
      error: (err) => {
        console.error('Error loading line item data:', err);
      }
    });
  }

  applyGrossRentCalculation(): void {
    const numUnits = this.adminSettings?.numberOfUnits;
    const rentEst1 = this.adminSettings?.expectedMonthlyRentEst1;
    const rentEst2 = this.adminSettings?.expectedMonthlyRentEst2;
    const totalSqFt = this.adminSettings?.totalSquareFeet;

    for (const item of this.allLineItems) {
      if (item.lineItemName === 'Expected Rent in 10 Years') {
        if (numUnits != null && rentEst1 != null) {
          item.est1Amount = numUnits * rentEst1 * 12 * 10;
        } else {
          item.est1Amount = null;
        }
        if (numUnits != null && rentEst2 != null) {
          item.est2Amount = numUnits * rentEst2 * 12 * 10;
        } else {
          item.est2Amount = null;
        }
        item.est1UnitAmount = this.computeUnit(item.est1Amount, numUnits);
        item.est1PerSqft = this.computePerSqft(item.est1Amount, totalSqFt);
        item.est2UnitAmount = this.computeUnit(item.est2Amount, numUnits);
        item.est2PerSqft = this.computePerSqft(item.est2Amount, totalSqFt);
      }
    }
  }

  private computeUnit(amount: number | null | undefined, units: number | null | undefined): number | null {
    if (amount == null || units == null || units === 0) return null;
    return Math.round((amount / units) * 100) / 100;
  }

  private computePerSqft(amount: number | null | undefined, sqft: number | null | undefined): number | null {
    if (amount == null || sqft == null || sqft === 0) return null;
    return Math.round((amount / sqft) * 100) / 100;
  }

  refreshTabData(): void {
    if (this.activeTab < 3) {
      const tabKey = TAB_LABELS[this.activeTab];
      const groups = TAB_GROUPS[tabKey] || [];
      const filtered = this.allLineItems.filter(item => groups.includes(item.groupName || ''));
      this.rowData = this.buildGroupedRowData(filtered);
    } else {
      this.computeAggregatedData();
    }
  }

  buildGroupedRowData(data: CaseLineItemDataDTO[]): GridRowData[] {
    const rows: GridRowData[] = [];
    const groupMap = new Map<string, CaseLineItemDataDTO[]>();
    const groupOrder: string[] = [];

    for (const item of data) {
      const group = item.groupName || 'Other';
      if (!groupMap.has(group)) {
        groupMap.set(group, []);
        groupOrder.push(group);
      }
      groupMap.get(group)!.push(item);
    }

    for (const group of groupOrder) {
      const items = groupMap.get(group)!;

      const totals = {
        est1Amount: null as number | null, est1UnitAmount: null as number | null, est1PerSqft: null as number | null,
        est2Amount: null as number | null, est2UnitAmount: null as number | null, est2PerSqft: null as number | null
      };

      for (const item of items) {
        if (item.est1Amount != null) totals.est1Amount = (totals.est1Amount || 0) + item.est1Amount;
        if (item.est1UnitAmount != null) totals.est1UnitAmount = (totals.est1UnitAmount || 0) + item.est1UnitAmount;
        if (item.est1PerSqft != null) totals.est1PerSqft = (totals.est1PerSqft || 0) + item.est1PerSqft;
        if (item.est2Amount != null) totals.est2Amount = (totals.est2Amount || 0) + item.est2Amount;
        if (item.est2UnitAmount != null) totals.est2UnitAmount = (totals.est2UnitAmount || 0) + item.est2UnitAmount;
        if (item.est2PerSqft != null) totals.est2PerSqft = (totals.est2PerSqft || 0) + item.est2PerSqft;
      }

      rows.push({
        lineItemId: -1,
        groupName: group,
        lineItemName: group,
        ...totals,
        est1Comments: null,
        est2Comments: null,
        isGroupRow: true
      });

      for (const item of items) {
        const isRent = item.lineItemName === 'Expected Rent in 10 Years';
        rows.push({
          lineItemId: item.lineItemId,
          groupName: item.groupName,
          lineItemName: item.lineItemName,
          est1Amount: item.est1Amount,
          est1UnitAmount: item.est1UnitAmount,
          est1PerSqft: item.est1PerSqft,
          est1Comments: item.est1Comments,
          est2Amount: item.est2Amount,
          est2UnitAmount: item.est2UnitAmount,
          est2PerSqft: item.est2PerSqft,
          est2Comments: item.est2Comments,
          isGroupRow: false,
          isRentRow: isRent
        });
      }
    }

    return rows;
  }

  computeAggregatedData(): void {
    const groupMap = new Map<string, AggregatedRow>();
    const groupOrder: string[] = [];

    for (const item of this.allLineItems) {
      const group = item.groupName || 'Other';
      if (!groupMap.has(group)) {
        groupMap.set(group, {
          groupName: group,
          est1Amount: null, est1UnitAmount: null, est1PerSqft: null,
          est2Amount: null, est2UnitAmount: null, est2PerSqft: null
        });
        groupOrder.push(group);
      }
      const agg = groupMap.get(group)!;
      if (item.est1Amount != null) agg.est1Amount = (agg.est1Amount || 0) + item.est1Amount;
      if (item.est1UnitAmount != null) agg.est1UnitAmount = (agg.est1UnitAmount || 0) + item.est1UnitAmount;
      if (item.est1PerSqft != null) agg.est1PerSqft = (agg.est1PerSqft || 0) + item.est1PerSqft;
      if (item.est2Amount != null) agg.est2Amount = (agg.est2Amount || 0) + item.est2Amount;
      if (item.est2UnitAmount != null) agg.est2UnitAmount = (agg.est2UnitAmount || 0) + item.est2UnitAmount;
      if (item.est2PerSqft != null) agg.est2PerSqft = (agg.est2PerSqft || 0) + item.est2PerSqft;
    }

    this.aggregatedData = groupOrder.map(g => groupMap.get(g)!);
  }

  onTabChange(tabIndex: number): void {
    this.activeTab = tabIndex;
    this.refreshTabData();
  }

  toggleEstimate2(): void {
    this.showEstimate2 = !this.showEstimate2;
    this.buildColumnDefs();
    this.buildAggregatedColumnDefs();
  }

  onCaseChange(): void {
    this.loadCaseData();
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    if (this.selectedCaseId == null) return;
    const data = event.data as GridRowData;
    if (data.isGroupRow || data.isRentRow) return;

    const colId = event.column.getColId();
    const numUnits = this.adminSettings?.numberOfUnits;
    const totalSqFt = this.adminSettings?.totalSquareFeet;

    if (colId === 'est1Amount' || colId === 'est1Comments') {
      const key = data.lineItemId + '_1';
      this.pendingChanges.set(key, {
        lineItemId: data.lineItemId,
        estimateId: 1,
        amount: data.est1Amount,
        comments: data.est1Comments
      });

      if (colId === 'est1Amount') {
        data.est1UnitAmount = this.computeUnit(data.est1Amount, numUnits);
        data.est1PerSqft = this.computePerSqft(data.est1Amount, totalSqFt);
      }

      const sourceItem = this.allLineItems.find(i => i.lineItemId === data.lineItemId);
      if (sourceItem) {
        sourceItem.est1Amount = data.est1Amount;
        sourceItem.est1UnitAmount = data.est1UnitAmount;
        sourceItem.est1PerSqft = data.est1PerSqft;
        sourceItem.est1Comments = data.est1Comments;
      }
    } else if (colId === 'est2Amount' || colId === 'est2Comments') {
      const key = data.lineItemId + '_2';
      this.pendingChanges.set(key, {
        lineItemId: data.lineItemId,
        estimateId: 2,
        amount: data.est2Amount,
        comments: data.est2Comments
      });

      if (colId === 'est2Amount') {
        data.est2UnitAmount = this.computeUnit(data.est2Amount, numUnits);
        data.est2PerSqft = this.computePerSqft(data.est2Amount, totalSqFt);
      }

      const sourceItem = this.allLineItems.find(i => i.lineItemId === data.lineItemId);
      if (sourceItem) {
        sourceItem.est2Amount = data.est2Amount;
        sourceItem.est2UnitAmount = data.est2UnitAmount;
        sourceItem.est2PerSqft = data.est2PerSqft;
        sourceItem.est2Comments = data.est2Comments;
      }
    }

    this.gridApi.applyTransaction({ update: [data] });
    this.recalculateGroupTotals();
  }

  recalculateGroupTotals(): void {
    const groupRows = this.rowData.filter(r => r.isGroupRow);
    for (const groupRow of groupRows) {
      const children = this.rowData.filter(r => !r.isGroupRow && r.groupName === groupRow.groupName);

      groupRow.est1Amount = null; groupRow.est1UnitAmount = null; groupRow.est1PerSqft = null;
      groupRow.est2Amount = null; groupRow.est2UnitAmount = null; groupRow.est2PerSqft = null;

      for (const child of children) {
        if (child.est1Amount != null) groupRow.est1Amount = (groupRow.est1Amount || 0) + child.est1Amount;
        if (child.est1UnitAmount != null) groupRow.est1UnitAmount = (groupRow.est1UnitAmount || 0) + child.est1UnitAmount;
        if (child.est1PerSqft != null) groupRow.est1PerSqft = (groupRow.est1PerSqft || 0) + child.est1PerSqft;
        if (child.est2Amount != null) groupRow.est2Amount = (groupRow.est2Amount || 0) + child.est2Amount;
        if (child.est2UnitAmount != null) groupRow.est2UnitAmount = (groupRow.est2UnitAmount || 0) + child.est2UnitAmount;
        if (child.est2PerSqft != null) groupRow.est2PerSqft = (groupRow.est2PerSqft || 0) + child.est2PerSqft;
      }
    }
    this.gridApi.applyTransaction({ update: groupRows });
  }

  onSave(): void {
    if (this.selectedCaseId == null || this.pendingChanges.size === 0) return;

    const updates = Array.from(this.pendingChanges.values());
    const numUnits = this.adminSettings?.numberOfUnits;
    const totalSqFt = this.adminSettings?.totalSquareFeet;

    this.caseService.updateAllLineItems(this.selectedCaseId, updates, numUnits, totalSqFt).subscribe({
      next: () => {
        this.pendingChanges.clear();
        this.loadCaseData();
      },
      error: (err) => {
        console.error('Error saving line items:', err);
      }
    });
  }

  onRefresh(): void {
    this.pendingChanges.clear();
    this.caseService.getAllAdminSettings().subscribe({
      next: (settings) => {
        if (settings.length > 0) {
          this.adminSettings = settings[0];
        }
        this.loadCaseData();
      },
      error: (err) => {
        console.error('Error loading admin settings:', err);
        this.loadCaseData();
      }
    });
  }

  get hasPendingChanges(): boolean {
    return this.pendingChanges.size > 0;
  }
}
