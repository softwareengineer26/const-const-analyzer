import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CostGridComponent } from './cost-grid.component';
import { CaseService } from '../../services/case.service';
import { CaseDTO, CaseLineItemDataDTO, AdminSettingsDTO } from '../../models/case.model';

describe('CostGridComponent', () => {
  let component: CostGridComponent;
  let fixture: ComponentFixture<CostGridComponent>;
  let caseService: jasmine.SpyObj<CaseService>;

  const mockAdminSettings: AdminSettingsDTO[] = [
    { id: 1, numberOfUnits: 100, totalSquareFeet: 20000 }
  ];

  const mockCases: CaseDTO[] = [
    { caseId: 1, caseName: 'Test Case 1', caseContact: 'Contact 1' },
    { caseId: 2, caseName: 'Test Case 2', caseContact: 'Contact 2' }
  ];

  const mockLineItems: CaseLineItemDataDTO[] = [
    { lineItemId: 1, groupName: 'Gross Rent', lineItemName: 'Expected Rent in 10 Years', amount: 50000, unitAmount: 500, perSqft: 2.5, comments: null },
    { lineItemId: 2, groupName: 'Foundation Phase', lineItemName: 'Excavation and Transportation', amount: 10000, unitAmount: 100, perSqft: 0.5, comments: 'test' },
    { lineItemId: 3, groupName: 'Foundation Phase', lineItemName: 'Compaction and leveling', amount: 8000, unitAmount: 80, perSqft: 0.4, comments: null }
  ];

  beforeEach(async () => {
    const caseServiceSpy = jasmine.createSpyObj('CaseService', [
      'getAllAdminSettings',
      'getAllCases',
      'getLineItemData',
      'updateLineItem',
      'updateAllLineItems'
    ]);

    caseServiceSpy.getAllAdminSettings.and.returnValue(of(mockAdminSettings));
    caseServiceSpy.getAllCases.and.returnValue(of(mockCases));
    caseServiceSpy.getLineItemData.and.returnValue(of(mockLineItems));
    caseServiceSpy.updateAllLineItems.and.returnValue(of(mockLineItems));

    await TestBed.configureTestingModule({
      imports: [CostGridComponent, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: CaseService, useValue: caseServiceSpy }
      ]
    }).compileComponents();

    caseService = TestBed.inject(CaseService) as jasmine.SpyObj<CaseService>;
    fixture = TestBed.createComponent(CostGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load admin settings on init', fakeAsync(() => {
    tick();
    expect(caseService.getAllAdminSettings).toHaveBeenCalled();
    expect(component.adminSettings).toEqual(mockAdminSettings[0]);
  }));

  it('should load cases after admin settings', fakeAsync(() => {
    tick();
    expect(caseService.getAllCases).toHaveBeenCalled();
    expect(component.cases.length).toBe(2);
    expect(component.selectedCaseId).toBe(1);
  }));

  it('should load line item data for selected case', fakeAsync(() => {
    tick();
    expect(caseService.getLineItemData).toHaveBeenCalledWith(1, 100, 20000);
  }));

  it('should build grouped row data with group headers', fakeAsync(() => {
    tick();
    const rows = component.rowData;
    const groupRows = rows.filter(r => r.isGroupRow);
    const dataRows = rows.filter(r => !r.isGroupRow);

    expect(groupRows.length).toBe(2);
    expect(dataRows.length).toBe(3);
    expect(groupRows[0].lineItemName).toBe('Gross Rent');
    expect(groupRows[1].lineItemName).toBe('Foundation Phase');
  }));

  it('should calculate aggregated values for group rows', fakeAsync(() => {
    tick();
    const groupRows = component.rowData.filter(r => r.isGroupRow);

    // Gross Rent group has 1 item with amount 50000
    expect(groupRows[0].amount).toBe(50000);

    // Foundation Phase group has 2 items with amounts 10000 + 8000 = 18000
    expect(groupRows[1].amount).toBe(18000);
  }));

  it('should make $/Unit and $/Sq.Ft. columns read-only', () => {
    const unitAmountCol = component.columnDefs.find(c => c.field === 'unitAmount');
    const perSqftCol = component.columnDefs.find(c => c.field === 'perSqft');

    expect(unitAmountCol?.editable).toBe(false);
    expect(perSqftCol?.editable).toBe(false);
  });

  it('should make $ Amount column editable for non-group rows', () => {
    const amountCol = component.columnDefs.find(c => c.field === 'amount');
    expect(amountCol).toBeDefined();

    if (typeof amountCol?.editable === 'function') {
      expect(amountCol.editable({ data: { isGroupRow: false } } as any)).toBeTrue();
      expect(amountCol.editable({ data: { isGroupRow: true } } as any)).toBeFalse();
    }
  });

  it('should track pending changes when cell value changes', fakeAsync(() => {
    tick();

    const mockEvent = {
      data: {
        lineItemId: 2,
        groupName: 'Foundation Phase',
        lineItemName: 'Excavation',
        amount: 15000,
        unitAmount: 150,
        perSqft: 0.75,
        comments: 'updated',
        isGroupRow: false
      },
      column: { getColId: () => 'comments' }
    };

    component.onCellValueChanged(mockEvent as any);

    expect(component.pendingChanges.has(2)).toBeTrue();
    expect(component.hasPendingChanges).toBeTrue();
  }));

  it('should recalculate $/Unit and $/Sq.Ft. when amount changes', fakeAsync(() => {
    tick();

    // Setup gridApi mock
    component['gridApi'] = {
      applyTransaction: jasmine.createSpy('applyTransaction'),
      sizeColumnsToFit: jasmine.createSpy('sizeColumnsToFit')
    } as any;

    const dataRow = component.rowData.find(r => r.lineItemId === 2);
    if (dataRow) {
      dataRow.amount = 20000;
      const mockEvent = {
        data: dataRow,
        column: { getColId: () => 'amount' }
      };

      component.onCellValueChanged(mockEvent as any);

      // 20000 / 100 units = 200
      expect(dataRow.unitAmount).toBe(200);
      // 20000 / 20000 sqft = 1
      expect(dataRow.perSqft).toBe(1);
    }
  }));

  it('should save pending changes', fakeAsync(() => {
    tick();
    component.selectedCaseId = 1;
    component.pendingChanges.set(2, {
      lineItemId: 2,
      amount: 15000,
      comments: 'updated'
    });

    component.onSave();
    tick();

    expect(caseService.updateAllLineItems).toHaveBeenCalledWith(
      1,
      [{ lineItemId: 2, amount: 15000, comments: 'updated' }],
      100,
      20000
    );
  }));

  it('should not save when no pending changes', () => {
    component.pendingChanges.clear();
    component.onSave();
    expect(caseService.updateAllLineItems).not.toHaveBeenCalled();
  });

  it('should clear pending changes and reload on refresh', fakeAsync(() => {
    component.pendingChanges.set(1, { lineItemId: 1, amount: 100, comments: '' });
    component.onRefresh();
    tick();

    expect(component.pendingChanges.size).toBe(0);
  }));

  it('should change case and reload data', fakeAsync(() => {
    tick();
    caseService.getLineItemData.calls.reset();
    component.selectedCaseId = 2;
    component.onCaseChange();
    tick();

    expect(caseService.getLineItemData).toHaveBeenCalledWith(2, 100, 20000);
  }));

  it('should handle error when loading admin settings', fakeAsync(() => {
    caseService.getAllAdminSettings.and.returnValue(throwError(() => new Error('Error')));
    spyOn(console, 'error');
    component.loadAdminSettings();
    tick();

    expect(console.error).toHaveBeenCalled();
    expect(caseService.getAllCases).toHaveBeenCalled();
  }));

  it('should have hasPendingChanges return false when no changes', () => {
    component.pendingChanges.clear();
    expect(component.hasPendingChanges).toBeFalse();
  });

  it('should format currency values in column definitions', () => {
    const amountCol = component.columnDefs.find(c => c.field === 'amount');
    if (amountCol?.valueFormatter && typeof amountCol.valueFormatter === 'function') {
      const result = amountCol.valueFormatter({ value: 1234.56 } as any);
      expect(result).toBe('1,234.56');

      const nullResult = amountCol.valueFormatter({ value: null } as any);
      expect(nullResult).toBe('');
    }
  });
});
