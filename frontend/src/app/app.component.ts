import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CostGridComponent } from './components/cost-grid/cost-grid.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CostGridComponent, AdminPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Construction Cost Analyzer';
  activeTab: string = 'cost-analyzer';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
