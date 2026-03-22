import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CaseService } from '../../services/case.service';
import { AdminSettingsDTO } from '../../models/case.model';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  settingsList: AdminSettingsDTO[] = [];
  numberOfUnits: number | null = null;
  totalSquareFeet: number | null = null;
  editingId: number | null = null;
  isAdding: boolean = false;

  constructor(private caseService: CaseService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.caseService.getAllAdminSettings().subscribe({
      next: (data) => {
        this.settingsList = data;
      },
      error: (err) => {
        console.error('Error loading admin settings:', err);
      }
    });
  }

  onAdd(): void {
    this.isAdding = true;
    this.numberOfUnits = null;
    this.totalSquareFeet = null;
  }

  onSaveNew(): void {
    const dto: AdminSettingsDTO = {
      id: null,
      numberOfUnits: this.numberOfUnits,
      totalSquareFeet: this.totalSquareFeet
    };
    this.caseService.createAdminSettings(dto).subscribe({
      next: () => {
        this.isAdding = false;
        this.numberOfUnits = null;
        this.totalSquareFeet = null;
        this.loadSettings();
      },
      error: (err) => {
        console.error('Error creating admin settings:', err);
      }
    });
  }

  onCancelAdd(): void {
    this.isAdding = false;
    this.numberOfUnits = null;
    this.totalSquareFeet = null;
  }

  onEdit(setting: AdminSettingsDTO): void {
    this.editingId = setting.id;
    this.numberOfUnits = setting.numberOfUnits;
    this.totalSquareFeet = setting.totalSquareFeet;
  }

  onUpdate(setting: AdminSettingsDTO): void {
    if (setting.id == null) return;
    const dto: AdminSettingsDTO = {
      id: setting.id,
      numberOfUnits: this.numberOfUnits,
      totalSquareFeet: this.totalSquareFeet
    };
    this.caseService.updateAdminSettings(setting.id, dto).subscribe({
      next: () => {
        this.editingId = null;
        this.numberOfUnits = null;
        this.totalSquareFeet = null;
        this.loadSettings();
      },
      error: (err) => {
        console.error('Error updating admin settings:', err);
      }
    });
  }

  onCancelEdit(): void {
    this.editingId = null;
    this.numberOfUnits = null;
    this.totalSquareFeet = null;
  }

  onDelete(id: number | null): void {
    if (id == null) return;
    if (confirm('Are you sure you want to delete this setting?')) {
      this.caseService.deleteAdminSettings(id).subscribe({
        next: () => {
          this.loadSettings();
        },
        error: (err) => {
          console.error('Error deleting admin settings:', err);
        }
      });
    }
  }
}
