import { Component, signal } from '@angular/core';
import { HyperPaginator, HyperPageEvent } from 'hypervault/paginator';
@Component({
  selector: 'app-paginator-page',
  imports: [HyperPaginator],
  templateUrl: './paginator-page.html',
})
export class PaginatorPage {
  pageEvent = signal<HyperPageEvent | null>(null);

  onPage(event: HyperPageEvent): void {
    this.pageEvent.set(event);
  }
}
