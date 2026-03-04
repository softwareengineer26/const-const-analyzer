import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CaseDTO, CaseLineItemDataDTO, CaseLineItemUpdateDTO } from '../models/case.model';
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

  getLineItemData(caseId: number): Observable<CaseLineItemDataDTO[]> {
    return this.http.get<CaseLineItemDataDTO[]>(`${this.apiUrl}/cases/${caseId}/line-items`);
  }

  updateLineItem(caseId: number, lineItemId: number, data: CaseLineItemUpdateDTO): Observable<CaseLineItemDataDTO> {
    return this.http.put<CaseLineItemDataDTO>(
      `${this.apiUrl}/cases/${caseId}/line-items/${lineItemId}`,
      data
    );
  }

  updateAllLineItems(caseId: number, data: CaseLineItemUpdateDTO[]): Observable<CaseLineItemDataDTO[]> {
    return this.http.put<CaseLineItemDataDTO[]>(
      `${this.apiUrl}/cases/${caseId}/line-items`,
      data
    );
  }
}
