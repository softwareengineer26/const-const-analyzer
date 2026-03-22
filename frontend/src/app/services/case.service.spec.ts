import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CaseService } from './case.service';
import { CaseDTO, CaseLineItemDataDTO, CaseLineItemUpdateDTO, AdminSettingsDTO } from '../models/case.model';
import { environment } from '../../environments/environment';

describe('CaseService', () => {
  let service: CaseService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CaseService]
    });

    service = TestBed.inject(CaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllCases', () => {
    it('should return all cases', () => {
      const mockCases: CaseDTO[] = [
        { caseId: 1, caseName: 'Case 1', caseContact: 'Contact 1' }
      ];

      service.getAllCases().subscribe(cases => {
        expect(cases.length).toBe(1);
        expect(cases[0].caseName).toBe('Case 1');
      });

      const req = httpMock.expectOne(`${apiUrl}/cases`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCases);
    });
  });

  describe('getCaseById', () => {
    it('should return a case by id', () => {
      const mockCase: CaseDTO = { caseId: 1, caseName: 'Case 1', caseContact: 'Contact 1' };

      service.getCaseById(1).subscribe(c => {
        expect(c.caseId).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/cases/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCase);
    });
  });

  describe('getLineItemData', () => {
    it('should get line items without params', () => {
      service.getLineItemData(1).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/cases/1/line-items`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.has('numberOfUnits')).toBeFalse();
      expect(req.request.params.has('totalSqFeet')).toBeFalse();
      req.flush([]);
    });

    it('should get line items with numberOfUnits and totalSqFeet params', () => {
      service.getLineItemData(1, 100, 20000).subscribe();

      const req = httpMock.expectOne(r => r.url === `${apiUrl}/cases/1/line-items`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('numberOfUnits')).toBe('100');
      expect(req.request.params.get('totalSqFeet')).toBe('20000');
      req.flush([]);
    });

    it('should handle null params', () => {
      service.getLineItemData(1, null, null).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/cases/1/line-items`);
      expect(req.request.params.has('numberOfUnits')).toBeFalse();
      expect(req.request.params.has('totalSqFeet')).toBeFalse();
      req.flush([]);
    });
  });

  describe('updateLineItem', () => {
    it('should update a single line item with params', () => {
      const updateDTO: CaseLineItemUpdateDTO = {
        lineItemId: 1,
        amount: 5000,
        comments: 'test'
      };

      service.updateLineItem(1, 1, updateDTO, 100, 20000).subscribe();

      const req = httpMock.expectOne(r => r.url === `${apiUrl}/cases/1/line-items/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateDTO);
      expect(req.request.params.get('numberOfUnits')).toBe('100');
      expect(req.request.params.get('totalSqFeet')).toBe('20000');
      req.flush({});
    });
  });

  describe('updateAllLineItems', () => {
    it('should update all line items with params', () => {
      const updates: CaseLineItemUpdateDTO[] = [
        { lineItemId: 1, amount: 5000, comments: 'test' },
        { lineItemId: 2, amount: 8000, comments: null }
      ];

      service.updateAllLineItems(1, updates, 100, 20000).subscribe();

      const req = httpMock.expectOne(r => r.url === `${apiUrl}/cases/1/line-items`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updates);
      expect(req.request.params.get('numberOfUnits')).toBe('100');
      expect(req.request.params.get('totalSqFeet')).toBe('20000');
      req.flush([]);
    });
  });

  describe('Admin Settings', () => {
    it('should get all admin settings', () => {
      const mockSettings: AdminSettingsDTO[] = [
        { id: 1, numberOfUnits: 100, totalSquareFeet: 20000 }
      ];

      service.getAllAdminSettings().subscribe(settings => {
        expect(settings.length).toBe(1);
        expect(settings[0].numberOfUnits).toBe(100);
      });

      const req = httpMock.expectOne(`${apiUrl}/admin-settings`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSettings);
    });

    it('should get admin settings by id', () => {
      const mockSetting: AdminSettingsDTO = { id: 1, numberOfUnits: 100, totalSquareFeet: 20000 };

      service.getAdminSettingsById(1).subscribe(setting => {
        expect(setting.id).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/admin-settings/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSetting);
    });

    it('should create admin settings', () => {
      const newSetting: AdminSettingsDTO = { id: null, numberOfUnits: 200, totalSquareFeet: 40000 };

      service.createAdminSettings(newSetting).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/admin-settings`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newSetting);
      req.flush({ ...newSetting, id: 2 });
    });

    it('should update admin settings', () => {
      const updated: AdminSettingsDTO = { id: 1, numberOfUnits: 300, totalSquareFeet: 60000 };

      service.updateAdminSettings(1, updated).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/admin-settings/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updated);
      req.flush(updated);
    });

    it('should delete admin settings', () => {
      service.deleteAdminSettings(1).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/admin-settings/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
