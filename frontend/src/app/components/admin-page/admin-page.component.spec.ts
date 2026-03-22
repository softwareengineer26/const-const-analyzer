import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AdminPageComponent } from './admin-page.component';
import { CaseService } from '../../services/case.service';
import { AdminSettingsDTO } from '../../models/case.model';

describe('AdminPageComponent', () => {
  let component: AdminPageComponent;
  let fixture: ComponentFixture<AdminPageComponent>;
  let caseService: jasmine.SpyObj<CaseService>;

  const mockSettings: AdminSettingsDTO[] = [
    { id: 1, numberOfUnits: 100, totalSquareFeet: 20000, expectedMonthlyRentEst1: 1500, expectedMonthlyRentEst2: 1800 },
    { id: 2, numberOfUnits: 200, totalSquareFeet: 40000, expectedMonthlyRentEst1: 2000, expectedMonthlyRentEst2: 2500 }
  ];

  beforeEach(async () => {
    const caseServiceSpy = jasmine.createSpyObj('CaseService', [
      'getAllAdminSettings',
      'getAdminSettingsById',
      'createAdminSettings',
      'updateAdminSettings',
      'deleteAdminSettings'
    ]);

    caseServiceSpy.getAllAdminSettings.and.returnValue(of(mockSettings));
    caseServiceSpy.createAdminSettings.and.returnValue(of(mockSettings[0]));
    caseServiceSpy.updateAdminSettings.and.returnValue(of(mockSettings[0]));
    caseServiceSpy.deleteAdminSettings.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [AdminPageComponent, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: CaseService, useValue: caseServiceSpy }
      ]
    }).compileComponents();

    caseService = TestBed.inject(CaseService) as jasmine.SpyObj<CaseService>;
    fixture = TestBed.createComponent(AdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load settings on init', () => {
    expect(caseService.getAllAdminSettings).toHaveBeenCalled();
    expect(component.settingsList.length).toBe(2);
  });

  it('should set isAdding to true when onAdd is called', () => {
    component.onAdd();
    expect(component.isAdding).toBeTrue();
    expect(component.numberOfUnits).toBeNull();
    expect(component.totalSquareFeet).toBeNull();
    expect(component.expectedMonthlyRentEst1).toBeNull();
    expect(component.expectedMonthlyRentEst2).toBeNull();
  });

  it('should cancel adding and reset fields', () => {
    component.onAdd();
    component.numberOfUnits = 50;
    component.totalSquareFeet = 10000;
    component.expectedMonthlyRentEst1 = 1000;
    component.expectedMonthlyRentEst2 = 1200;
    component.onCancelAdd();
    expect(component.isAdding).toBeFalse();
    expect(component.numberOfUnits).toBeNull();
    expect(component.totalSquareFeet).toBeNull();
    expect(component.expectedMonthlyRentEst1).toBeNull();
    expect(component.expectedMonthlyRentEst2).toBeNull();
  });

  it('should create new settings on save', fakeAsync(() => {
    component.onAdd();
    component.numberOfUnits = 150;
    component.totalSquareFeet = 30000;
    component.expectedMonthlyRentEst1 = 1500;
    component.expectedMonthlyRentEst2 = 1800;
    component.onSaveNew();
    tick();

    expect(caseService.createAdminSettings).toHaveBeenCalledWith({
      id: null,
      numberOfUnits: 150,
      totalSquareFeet: 30000,
      expectedMonthlyRentEst1: 1500,
      expectedMonthlyRentEst2: 1800
    });
    expect(component.isAdding).toBeFalse();
  }));

  it('should set editing state when onEdit is called', () => {
    const setting = mockSettings[0];
    component.onEdit(setting);
    expect(component.editingId).toBe(1);
    expect(component.numberOfUnits).toBe(100);
    expect(component.totalSquareFeet).toBe(20000);
    expect(component.expectedMonthlyRentEst1).toBe(1500);
    expect(component.expectedMonthlyRentEst2).toBe(1800);
  });

  it('should cancel editing and reset fields', () => {
    component.onEdit(mockSettings[0]);
    component.onCancelEdit();
    expect(component.editingId).toBeNull();
    expect(component.numberOfUnits).toBeNull();
    expect(component.totalSquareFeet).toBeNull();
    expect(component.expectedMonthlyRentEst1).toBeNull();
    expect(component.expectedMonthlyRentEst2).toBeNull();
  });

  it('should update settings', fakeAsync(() => {
    component.onEdit(mockSettings[0]);
    component.numberOfUnits = 250;
    component.totalSquareFeet = 50000;
    component.expectedMonthlyRentEst1 = 2000;
    component.expectedMonthlyRentEst2 = 2500;
    component.onUpdate(mockSettings[0]);
    tick();

    expect(caseService.updateAdminSettings).toHaveBeenCalledWith(1, {
      id: 1,
      numberOfUnits: 250,
      totalSquareFeet: 50000,
      expectedMonthlyRentEst1: 2000,
      expectedMonthlyRentEst2: 2500
    });
    expect(component.editingId).toBeNull();
  }));

  it('should not update if setting id is null', () => {
    const nullSetting: AdminSettingsDTO = { id: null, numberOfUnits: 100, totalSquareFeet: 20000, expectedMonthlyRentEst1: null, expectedMonthlyRentEst2: null };
    component.onUpdate(nullSetting);
    expect(caseService.updateAdminSettings).not.toHaveBeenCalled();
  });

  it('should delete settings when confirmed', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.onDelete(1);
    tick();

    expect(caseService.deleteAdminSettings).toHaveBeenCalledWith(1);
  }));

  it('should not delete settings when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDelete(1);
    expect(caseService.deleteAdminSettings).not.toHaveBeenCalled();
  });

  it('should not delete when id is null', () => {
    component.onDelete(null);
    expect(caseService.deleteAdminSettings).not.toHaveBeenCalled();
  });

  it('should handle error when loading settings', fakeAsync(() => {
    caseService.getAllAdminSettings.and.returnValue(throwError(() => new Error('Load error')));
    spyOn(console, 'error');
    component.loadSettings();
    tick();
    expect(console.error).toHaveBeenCalled();
  }));

  it('should handle error when creating settings', fakeAsync(() => {
    caseService.createAdminSettings.and.returnValue(throwError(() => new Error('Create error')));
    spyOn(console, 'error');
    component.onAdd();
    component.onSaveNew();
    tick();
    expect(console.error).toHaveBeenCalled();
  }));
});
