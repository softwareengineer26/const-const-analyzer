import { Component } from '@angular/core';
import { CostGridComponent } from './components/cost-grid/cost-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CostGridComponent],
  template: '<app-cost-grid></app-cost-grid>',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Construction Cost Tracker';
}
