import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CaseDTO, CaseLineItemDataDTO, CaseLineItemUpdateDTO, AdminSettingsDTO } from '../models/case.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaseService {

  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAllCases(): Observable<CaseDTO[]> {
    return this.http.get<CaseDTO[]>(`${this.apiUrl}/cases`);
  }

  getCaseById(caseId: number): Observable<CaseDTO> {
    return this.http.get<CaseDTO>(`${this.apiUrl}/cases/${caseId}`);
  }

  getLineItemData(caseId: number, numberOfUnits?: number | null, totalSqFeet?: number | null): Observable<CaseLineItemDataDTO[]> {
    let params = new HttpParams();
    if (numberOfUnits != null) {
      params = params.set('numberOfUnits', numberOfUnits.toString());
    }
    if (totalSqFeet != null) {
      params = params.set('totalSqFeet', totalSqFeet.toString());
    }
    return this.http.get<CaseLineItemDataDTO[]>(`${this.apiUrl}/cases/${caseId}/line-items`, { params });
  }

  updateLineItem(caseId: number, lineItemId: number, data: CaseLineItemUpdateDTO,
                 numberOfUnits?: number | null, totalSqFeet?: number | null): Observable<CaseLineItemDataDTO> {
    let params = new HttpParams();
    if (numberOfUnits != null) {
      params = params.set('numberOfUnits', numberOfUnits.toString());
    }
    if (totalSqFeet != null) {
      params = params.set('totalSqFeet', totalSqFeet.toString());
    }
    return this.http.put<CaseLineItemDataDTO>(
      `${this.apiUrl}/cases/${caseId}/line-items/${lineItemId}`,
      data,
      { params }
    );
  }

  updateAllLineItems(caseId: number, data: CaseLineItemUpdateDTO[],
                     numberOfUnits?: number | null, totalSqFeet?: number | null): Observable<CaseLineItemDataDTO[]> {
    let params = new HttpParams();
    if (numberOfUnits != null) {
      params = params.set('numberOfUnits', numberOfUnits.toString());
    }
    if (totalSqFeet != null) {
      params = params.set('totalSqFeet', totalSqFeet.toString());
    }
    return this.http.put<CaseLineItemDataDTO[]>(
      `${this.apiUrl}/cases/${caseId}/line-items`,
      data,
      { params }
    );
  }

  // Admin Settings API
  getAllAdminSettings(): Observable<AdminSettingsDTO[]> {
    return this.http.get<AdminSettingsDTO[]>(`${this.apiUrl}/admin-settings`);
  }

  getAdminSettingsById(id: number): Observable<AdminSettingsDTO> {
    return this.http.get<AdminSettingsDTO>(`${this.apiUrl}/admin-settings/${id}`);
  }

  createAdminSettings(data: AdminSettingsDTO): Observable<AdminSettingsDTO> {
    return this.http.post<AdminSettingsDTO>(`${this.apiUrl}/admin-settings`, data);
  }

  updateAdminSettings(id: number, data: AdminSettingsDTO): Observable<AdminSettingsDTO> {
    return this.http.put<AdminSettingsDTO>(`${this.apiUrl}/admin-settings/${id}`, data);
  }

  deleteAdminSettings(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin-settings/${id}`);
  }
}
