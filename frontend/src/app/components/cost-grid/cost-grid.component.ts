import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, CellValueChangedEvent } from 'ag-grid-community';
import { CaseService } from '../../services/case.service';
import { CaseDTO, CaseLineItemDataDTO, CaseLineItemUpdateDTO, AdminSettingsDTO } from '../../models/case.model';

interface GridRowData {
  lineItemId: number;
  groupName: string | null;
  lineItemName: string;
  amount: number | null;
  unitAmount: number | null;
  perSqft: number | null;
  comments: string | null;
  isGroupRow?: boolean;
}

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
  rowData: GridRowData[] = [];
  pendingChanges: Map<number, CaseLineItemUpdateDTO> = new Map();
  adminSettings: AdminSettingsDTO | null = null;

  columnDefs: ColDef[] = [
    {
      headerName: 'LineItems',
      field: 'lineItemName',
      editable: false,
      width: 350,
      minWidth: 250,
      cellStyle: (params): Record<string, string> => {
        if (params.data?.isGroupRow) {
          return { fontWeight: 'bold', backgroundColor: '#e8f0fe', fontSize: '14px' };
        }
        return { paddingLeft: '30px' };
      }
    },
    {
      headerName: '$ Amount',
      field: 'amount',
      editable: (params) => !params.data?.isGroupRow,
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
        if (params.data?.isGroupRow) return false;
        const newValue = params.newValue === '' || params.newValue == null ? null : Number(params.newValue);
        if (newValue !== null && (isNaN(newValue) || newValue > 10000000)) {
          return false;
        }
        params.data.amount = newValue;
        return true;
      },
      cellStyle: (params): Record<string, string> => {
        if (params.data?.isGroupRow) {
          return { fontWeight: 'bold', backgroundColor: '#e8f0fe' };
        }
        return {};
      }
    },
    {
      headerName: '$/Unit',
      field: 'unitAmount',
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
      cellStyle: (params) => {
        const base: Record<string, string> = { backgroundColor: '#f5f5f5', color: '#666' };
        if (params.data?.isGroupRow) {
          base['fontWeight'] = 'bold';
          base['backgroundColor'] = '#e8f0fe';
        }
        return base;
      }
    },
    {
      headerName: '$/Sq.Ft.',
      field: 'perSqft',
      editable: false,
      width: 120,
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
    },
    {
      headerName: 'Comments',
      field: 'comments',
      editable: (params) => !params.data?.isGroupRow,
      width: 300,
      minWidth: 200,
      valueSetter: (params) => {
        if (params.data?.isGroupRow) return false;
        const newValue = params.newValue || '';
        if (newValue.length > 300) {
          return false;
        }
        params.data.comments = newValue;
        return true;
      },
      cellStyle: (params): Record<string, string> => {
        if (params.data?.isGroupRow) {
          return { backgroundColor: '#e8f0fe' };
        }
        return {};
      }
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: false
  };

  constructor(private caseService: CaseService) {}

  ngOnInit(): void {
    this.loadAdminSettings();
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
        this.rowData = this.buildGroupedRowData(data);
        this.pendingChanges.clear();
      },
      error: (err) => {
        console.error('Error loading line item data:', err);
      }
    });
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

      let totalAmount: number | null = null;
      let totalUnitAmount: number | null = null;
      let totalPerSqft: number | null = null;

      for (const item of items) {
        if (item.amount != null) {
          totalAmount = (totalAmount || 0) + item.amount;
        }
        if (item.unitAmount != null) {
          totalUnitAmount = (totalUnitAmount || 0) + item.unitAmount;
        }
        if (item.perSqft != null) {
          totalPerSqft = (totalPerSqft || 0) + item.perSqft;
        }
      }

      rows.push({
        lineItemId: -1,
        groupName: group,
        lineItemName: group,
        amount: totalAmount,
        unitAmount: totalUnitAmount,
        perSqft: totalPerSqft,
        comments: null,
        isGroupRow: true
      });

      for (const item of items) {
        rows.push({
          lineItemId: item.lineItemId,
          groupName: item.groupName,
          lineItemName: item.lineItemName,
          amount: item.amount,
          unitAmount: item.unitAmount,
          perSqft: item.perSqft,
          comments: item.comments,
          isGroupRow: false
        });
      }
    }

    return rows;
  }

  onCaseChange(): void {
    this.loadCaseData();
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    if (this.selectedCaseId == null) return;
    const data = event.data as GridRowData;
    if (data.isGroupRow) return;

    this.pendingChanges.set(data.lineItemId, {
      lineItemId: data.lineItemId,
      amount: data.amount,
      comments: data.comments
    });

    // Recalculate $/Unit and $/Sq.Ft locally for immediate feedback
    if (event.column.getColId() === 'amount') {
      const numUnits = this.adminSettings?.numberOfUnits;
      const totalSqFt = this.adminSettings?.totalSquareFeet;

      if (data.amount != null && numUnits != null && numUnits > 0) {
        data.unitAmount = data.amount / numUnits;
      } else {
        data.unitAmount = null;
      }

      if (data.amount != null && totalSqFt != null && totalSqFt > 0) {
        data.perSqft = data.amount / totalSqFt;
      } else {
        data.perSqft = null;
      }

      // Refresh the row to show updated computed values
      this.gridApi.applyTransaction({ update: [data] });

      // Recalculate group aggregation
      this.recalculateGroupTotals();
    }
  }

  recalculateGroupTotals(): void {
    const groupRows = this.rowData.filter(r => r.isGroupRow);
    for (const groupRow of groupRows) {
      const children = this.rowData.filter(r => !r.isGroupRow && r.groupName === groupRow.groupName);

      let totalAmount: number | null = null;
      let totalUnitAmount: number | null = null;
      let totalPerSqft: number | null = null;

      for (const child of children) {
        if (child.amount != null) totalAmount = (totalAmount || 0) + child.amount;
        if (child.unitAmount != null) totalUnitAmount = (totalUnitAmount || 0) + child.unitAmount;
        if (child.perSqft != null) totalPerSqft = (totalPerSqft || 0) + child.perSqft;
      }

      groupRow.amount = totalAmount;
      groupRow.unitAmount = totalUnitAmount;
      groupRow.perSqft = totalPerSqft;
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
    this.loadAdminSettings();
  }

  get hasPendingChanges(): boolean {
    return this.pendingChanges.size > 0;
  }
}
