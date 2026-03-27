import { Component, signal } from '@angular/core';
import { HyperDatepicker, HyperCalendar } from 'hypervault/datepicker';
@Component({
  selector: 'app-datepicker-page',
  imports: [HyperDatepicker, HyperCalendar],
  templateUrl: './datepicker-page.html',
})
export class DatepickerPage {
  readonly selectedDate = signal<Date | null>(null);
  readonly calendarDate = signal<Date | null>(null);

  readonly minDate = new Date(2024, 0, 1);
  readonly maxDate = new Date(2025, 11, 31);

  noWeekends = (date: Date): boolean => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  formatDate(d: Date | null): string {
    if (!d) return 'Nenhuma';
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
}
