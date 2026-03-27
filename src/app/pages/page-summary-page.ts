import { Component } from '@angular/core';
import { HyperDivider } from 'hypervault/divider';
import { HyperPageSummary } from 'hypervault/page-summary';

@Component({
  selector: 'app-page-summary-page',
  imports: [HyperDivider, HyperPageSummary],
  templateUrl: './page-summary-page.html',
  styles: [`
    .ps-demo-layout {
      display: grid;
      grid-template-columns: 1fr 220px;
      gap: 2rem;
      align-items: start;
    }

    .ps-demo-content {
      min-width: 0;
      display: grid;
      gap: 2rem;
    }

    @media (max-width: 720px) {
      .ps-demo-layout {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class PageSummaryPage {}
