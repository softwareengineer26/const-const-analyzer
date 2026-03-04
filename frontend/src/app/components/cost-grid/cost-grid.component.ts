import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, CellValueChangedEvent } from 'ag-grid-community';
import { CaseService } from '../../services/case.service';
import { CaseDTO, CaseLineItemDataDTO, CaseLineItemUpdateDTO } from '../../models/case.model';

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
  rowData: CaseLineItemDataDTO[] = [];

  columnDefs: ColDef[] = [
    {
      headerName: 'LineItems',
      field: 'lineItemName',
      editable: false,
      width: 350,
      minWidth: 250,
      cellStyle: { fontWeight: 'bold' }
    },
    {
      headerName: '$ Amount',
      field: 'amount',
      editable: true,
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
        const newValue = params.newValue === '' || params.newValue == null ? null : Number(params.newValue);
        if (newValue !== null && (isNaN(newValue) || newValue > 10000000)) {
          return false;
        }
        params.data.amount = newValue;
        return true;
      }
    },
    {
      headerName: '$/Unit Amount',
      field: 'unitAmount',
      editable: true,
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
        const newValue = params.newValue === '' || params.newValue == null ? null : Number(params.newValue);
        if (newValue !== null && (isNaN(newValue) || newValue > 10000000)) {
          return false;
        }
        params.data.unitAmount = newValue;
        return true;
      }
    },
    {
      headerName: '$/Sq.Ft.',
      field: 'perSqft',
      editable: true,
      width: 100,
      minWidth: 80,
      type: 'numericColumn',
      valueFormatter: (params) => {
        if (params.value == null) return '';
        return Number(params.value).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      },
      valueSetter: (params) => {
        const newValue = params.newValue === '' || params.newValue == null ? null : Number(params.newValue);
        if (newValue !== null && (isNaN(newValue) || newValue > 1000)) {
          return false;
        }
        params.data.perSqft = newValue;
        return true;
      }
    },
    {
      headerName: 'Comments',
      field: 'comments',
      editable: true,
      width: 350,
      minWidth: 250,
      valueSetter: (params) => {
        const newValue = params.newValue || '';
        if (newValue.length > 300) {
          return false;
        }
        params.data.comments = newValue;
        return true;
      }
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true
  };

  constructor(private caseService: CaseService) {}

  ngOnInit(): void {
    this.loadCases();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
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

    this.caseService.getLineItemData(this.selectedCaseId).subscribe({
      next: (data) => {
        this.rowData = data;
      },
      error: (err) => {
        console.error('Error loading line item data:', err);
      }
    });
  }

  onCaseChange(): void {
    this.loadCaseData();
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    if (this.selectedCaseId == null) return;

    const data = event.data as CaseLineItemDataDTO;
    const updateDTO: CaseLineItemUpdateDTO = {
      lineItemId: data.lineItemId,
      amount: data.amount,
      unitAmount: data.unitAmount,
      perSqft: data.perSqft,
      comments: data.comments
    };

    this.caseService.updateLineItem(this.selectedCaseId, data.lineItemId, updateDTO).subscribe({
      next: (updated) => {
        console.log('Updated successfully:', updated);
      },
      error: (err) => {
        console.error('Error updating line item:', err);
        // Reload data on error to revert changes
        this.loadCaseData();
      }
    });
  }
}
