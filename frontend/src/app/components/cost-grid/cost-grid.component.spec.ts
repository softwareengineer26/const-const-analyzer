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
    { id: 1, numberOfUnits: 100, totalSquareFeet: 20000, expectedMonthlyRentEst1: 1500, expectedMonthlyRentEst2: 1800 }
  ];

  const mockCases: CaseDTO[] = [
    { caseId: 1, caseName: 'Test Case 1', caseContact: 'Contact 1' },
    { caseId: 2, caseName: 'Test Case 2', caseContact: 'Contact 2' }
  ];

  const mockLineItems: CaseLineItemDataDTO[] = [
    { lineItemId: 1, groupName: 'Gross Rent', lineItemName: 'Expected Rent in 10 Years',
      est1Amount: 50000, est1UnitAmount: 500, est1PerSqft: 2.5, est1Comments: null,
      est2Amount: null, est2UnitAmount: null, est2PerSqft: null, est2Comments: null },
    { lineItemId: 2, groupName: 'Foundation Phase', lineItemName: 'Excavation and Transportation',
      est1Amount: 10000, est1UnitAmount: 100, est1PerSqft: 0.5, est1Comments: 'test',
      est2Amount: 12000, est2UnitAmount: 120, est2PerSqft: 0.6, est2Comments: null },
    { lineItemId: 3, groupName: 'Foundation Phase', lineItemName: 'Compaction and leveling',
      est1Amount: 8000, est1UnitAmount: 80, est1PerSqft: 0.4, est1Comments: null,
      est2Amount: 9000, est2UnitAmount: 90, est2PerSqft: 0.45, est2Comments: null },
    { lineItemId: 4, groupName: 'Internal Construction (base)', lineItemName: 'Framing',
      est1Amount: 20000, est1UnitAmount: 200, est1PerSqft: 1.0, est1Comments: null,
      est2Amount: null, est2UnitAmount: null, est2PerSqft: null, est2Comments: null }
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

  it('should default to Tab 1 showing Gross Rent and Foundation Phase groups', fakeAsync(() => {
    tick();
    expect(component.activeTab).toBe(0);
    const rows = component.rowData;
    const groupRows = rows.filter(r => r.isGroupRow);
    expect(groupRows.length).toBe(2);
    expect(groupRows[0].lineItemName).toBe('Gross Rent');
    expect(groupRows[1].lineItemName).toBe('Foundation Phase');
  }));

  it('should calculate aggregated est1 values for group rows', fakeAsync(() => {
    tick();
    const groupRows = component.rowData.filter(r => r.isGroupRow);
    // Foundation Phase group: est1Amount = 10000 + 8000 = 18000
    const fpGroup = groupRows.find(r => r.lineItemName === 'Foundation Phase');
    expect(fpGroup?.est1Amount).toBe(18000);
  }));

  it('should have Estimate# 1 column group in columnDefs', () => {
    const est1Group = component.columnDefs.find(
      (c: any) => c.headerName === 'Estimate# 1'
    );
    expect(est1Group).toBeDefined();
  });

  it('should hide Estimate# 2 by default', () => {
    expect(component.showEstimate2).toBeFalse();
    const est2Group = component.columnDefs.find(
      (c: any) => c.headerName === 'Estimate# 2'
    );
    expect(est2Group).toBeUndefined();
  });

  it('should show Estimate# 2 after toggle', () => {
    component.toggleEstimate2();
    expect(component.showEstimate2).toBeTrue();
    const est2Group = component.columnDefs.find(
      (c: any) => c.headerName === 'Estimate# 2'
    );
    expect(est2Group).toBeDefined();
  });

  it('should switch tabs and update rowData', fakeAsync(() => {
    tick();
    // Switch to Tab 2 - should show Internal Construction (base)
    component.onTabChange(1);
    const groupRows = component.rowData.filter(r => r.isGroupRow);
    expect(groupRows.some(r => r.lineItemName === 'Internal Construction (base)')).toBeTrue();
    expect(groupRows.some(r => r.lineItemName === 'Foundation Phase')).toBeFalse();
  }));

  it('should compute aggregated data on Tab 4', fakeAsync(() => {
    tick();
    component.onTabChange(3);
    expect(component.aggregatedData.length).toBeGreaterThan(0);
    const fpAgg = component.aggregatedData.find(a => a.groupName === 'Foundation Phase');
    expect(fpAgg?.est1Amount).toBe(18000);
  }));

  it('should calculate gross rent for Expected Rent in 10 Years', fakeAsync(() => {
    tick();
    const rentItem = component.allLineItems.find(i => i.lineItemName === 'Expected Rent in 10 Years');
    // 100 units * 1500 rent * 12 months * 10 years = 18,000,000
    expect(rentItem?.est1Amount).toBe(18000000);
    // 100 units * 1800 rent * 12 months * 10 years = 21,600,000
    expect(rentItem?.est2Amount).toBe(21600000);
  }));

  it('should make Expected Rent in 10 Years read-only', fakeAsync(() => {
    tick();
    const rentRow = component.rowData.find(r => r.lineItemName === 'Expected Rent in 10 Years');
    expect(rentRow?.isRentRow).toBeTrue();
  }));

  it('should track pending changes with estimateId when est1 cell changes', fakeAsync(() => {
    tick();
    component['gridApi'] = {
      applyTransaction: jasmine.createSpy('applyTransaction'),
      sizeColumnsToFit: jasmine.createSpy('sizeColumnsToFit')
    } as any;

    const dataRow = component.rowData.find(r => r.lineItemId === 2);
    if (dataRow) {
      dataRow.est1Amount = 15000;
      const mockEvent = {
        data: dataRow,
        column: { getColId: () => 'est1Amount' }
      };
      component.onCellValueChanged(mockEvent as any);
      expect(component.pendingChanges.has('2_1')).toBeTrue();
      const change = component.pendingChanges.get('2_1');
      expect(change?.estimateId).toBe(1);
      expect(change?.amount).toBe(15000);
    }
  }));

  it('should recalculate est1UnitAmount and est1PerSqft when est1Amount changes', fakeAsync(() => {
    tick();
    component['gridApi'] = {
      applyTransaction: jasmine.createSpy('applyTransaction'),
      sizeColumnsToFit: jasmine.createSpy('sizeColumnsToFit')
    } as any;

    const dataRow = component.rowData.find(r => r.lineItemId === 2);
    if (dataRow) {
      dataRow.est1Amount = 20000;
      const mockEvent = {
        data: dataRow,
        column: { getColId: () => 'est1Amount' }
      };
      component.onCellValueChanged(mockEvent as any);
      // 20000 / 100 units = 200
      expect(dataRow.est1UnitAmount).toBe(200);
      // 20000 / 20000 sqft = 1
      expect(dataRow.est1PerSqft).toBe(1);
    }
  }));

  it('should save pending changes with estimateId', fakeAsync(() => {
    tick();
    component.selectedCaseId = 1;
    component.pendingChanges.set('2_1', {
      lineItemId: 2,
      estimateId: 1,
      amount: 15000,
      comments: 'updated'
    });

    component.onSave();
    tick();

    expect(caseService.updateAllLineItems).toHaveBeenCalledWith(
      1,
      [{ lineItemId: 2, estimateId: 1, amount: 15000, comments: 'updated' }],
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
    component.pendingChanges.set('1_1', { lineItemId: 1, estimateId: 1, amount: 100, comments: '' });
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

  it('should build aggregated column defs with Estimate# 2 after toggle', () => {
    component.toggleEstimate2();
    const est2AggGroup = component.aggregatedColumnDefs.find(
      (c: any) => c.headerName === 'Estimate# 2'
    );
    expect(est2AggGroup).toBeDefined();
  });
});
