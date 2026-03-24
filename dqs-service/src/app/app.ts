import { Component, signal } from '@angular/core';
import { NgIf, NgFor, NgStyle } from '@angular/common';  // *ngIf, *ngFor, [ngStyle]
import { FormsModule } from '@angular/forms';           // ngModel
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { DataService } from './data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    NgStyle,         // <-- konieczne dla [ngStyle]
    NzSelectModule,
    NzTableModule,
    NzButtonModule,
    NzSpinModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = signal('EDEN Data Quality Service');

  selectedRepo: string | null = null;
  repositories: any[] = [];
  results = signal<{ category: string; dimension: string; result?: number }[]>([]);
  loading = signal(false);

  constructor(private dataService: DataService) {
    this.loadRepositories();
    this.initResults();
  }

  loadRepositories() {
    this.dataService.getRepositories().subscribe((repos) => {
      this.repositories = repos;
    });
  }


  initResults() {
    this.results.set([
      { category: 'Intrinsic', dimension: 'Believability' },
      { category: 'Contextual', dimension: 'Value-added' },
      { category: 'Contextual', dimension: 'Relevancy' },
      { category: 'Intrinsic', dimension: 'Accuracy' },
      { category: 'Representational', dimension: 'Interpretability' },
      { category: 'Representational', dimension: 'Ease of understanding' },
      { category: 'Accessibility', dimension: 'Accessibility' },
      { category: 'Intrinsic', dimension: 'Objectivity' },
      { category: 'Contextual', dimension: 'Timeliness' },
      { category: 'Contextual', dimension: 'Completeness' },
      { category: 'Intrinsic', dimension: 'Reputation' },
      { category: 'Representational', dimension: 'Representational consistency' },
      { category: 'Representational', dimension: 'Concise representation' },
      { category: 'Accessibility', dimension: 'Access security' },
      { category: 'Contextual', dimension: 'Amount of data' },
    ]);
  }


run() {
  if (!this.selectedRepo || this.loading()) return;

  this.loading.set(true); // 🔥 tylko tak dla signal

  this.dataService.runCheck().subscribe({
    next: (data) => {
      const resultMap = new Map(data.map(d => [d.dimension, d.result]));

      this.results.set(
        this.results().map(r => ({
          ...r,
          result: resultMap.get(r.dimension) ?? undefined
        }))
      );

      this.loading.set(false);
    },
    error: (err) => {
      console.error('ERROR:', err);
      this.loading.set(false);
    }
  });
}

  getColor(value?: number) {
    if (value == null) return '';
    if (value < 60) return '#d9534f';
    if (value <= 80) return '#f0ad4e';
    return '#5cb85c';
  }
}