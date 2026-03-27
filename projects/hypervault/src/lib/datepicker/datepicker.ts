import {
  Component,
  Directive,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  computed,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// ── Calendar ──

const DAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const MONTHS_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'hyper-calendar',
  styleUrl: './datepicker.scss',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './datepicker-calendar.html',
  host: {
    'class': 'hyper-calendar',
    '[class.hyper-calendar-secondary]': "color() === 'secondary'",
    '(keydown)': 'onKeydown($event)',
  },
})
export class HyperCalendar implements OnInit {
  readonly selected = model<Date | null>(null);
  readonly min = input<Date | undefined>(undefined);
  readonly max = input<Date | undefined>(undefined);
  readonly dateFilter = input<((date: Date) => boolean) | undefined>(undefined);
  readonly firstDayOfWeek = input(0); // 0 = Sunday
  readonly color = input<'primary' | 'secondary'>('primary');
  readonly startView = input<'month' | 'year' | 'multi-year'>('month');

  readonly currentView = signal<'month' | 'year' | 'multi-year'>('month');
  readonly viewDate = signal(new Date());

  readonly weekDays = computed(() => {
    const start = this.firstDayOfWeek();
    return Array.from({ length: 7 }, (_, i) => DAYS_PT[(start + i) % 7]);
  });

  readonly headerLabel = computed(() => {
    const d = this.viewDate();
    const view = this.currentView();
    if (view === 'month') return `${MONTHS_PT[d.getMonth()]} ${d.getFullYear()}`;
    if (view === 'year') return `${d.getFullYear()}`;
    const startYear = Math.floor(d.getFullYear() / 24) * 24;
    return `${startYear} – ${startYear + 23}`;
  });

  readonly calendarDays = computed<CalendarDay[]>(() => {
    const vd = this.viewDate();
    const year = vd.getFullYear();
    const month = vd.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() - this.firstDayOfWeek() + 7) % 7;
    const today = new Date();
    const sel = this.selected();
    const minDate = this.min();
    const maxDate = this.max();
    const filter = this.dateFilter();

    const days: CalendarDay[] = [];

    // Previous month fill
    for (let i = startOffset - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(this.createDay(date, false, today, sel, minDate, maxDate, filter));
    }

    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push(this.createDay(date, true, today, sel, minDate, maxDate, filter));
    }

    // Next month fill
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d);
      days.push(this.createDay(date, false, today, sel, minDate, maxDate, filter));
    }

    return days;
  });

  readonly months = computed(() => MONTHS_SHORT);

  readonly years = computed(() => {
    const startYear = Math.floor(this.viewDate().getFullYear() / 24) * 24;
    return Array.from({ length: 24 }, (_, i) => startYear + i);
  });

  ngOnInit(): void {
    const sel = this.selected();
    if (sel) {
      this.viewDate.set(new Date(sel.getFullYear(), sel.getMonth(), 1));
    }
    this.currentView.set(this.startView());
  }

  private createDay(
    date: Date, isCurrentMonth: boolean, today: Date,
    sel: Date | null, min?: Date, max?: Date, filter?: (d: Date) => boolean,
  ): CalendarDay {
    const isToday = this.sameDay(date, today);
    const isSelected = sel ? this.sameDay(date, sel) : false;
    let isDisabled = false;
    if (min && date < this.startOfDay(min)) isDisabled = true;
    if (max && date > this.startOfDay(max)) isDisabled = true;
    if (filter && !filter(date)) isDisabled = true;
    return { date, day: date.getDate(), isCurrentMonth, isToday, isSelected, isDisabled };
  }

  selectDay(day: CalendarDay): void {
    if (day.isDisabled) return;
    this.selected.set(day.date);
  }

  selectMonth(monthIndex: number): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), monthIndex, 1));
    this.currentView.set('month');
  }

  selectYear(year: number): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(year, d.getMonth(), 1));
    this.currentView.set('year');
  }

  previousPeriod(): void {
    const d = this.viewDate();
    const view = this.currentView();
    if (view === 'month') {
      this.viewDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
    } else if (view === 'year') {
      this.viewDate.set(new Date(d.getFullYear() - 1, d.getMonth(), 1));
    } else {
      this.viewDate.set(new Date(d.getFullYear() - 24, d.getMonth(), 1));
    }
  }

  nextPeriod(): void {
    const d = this.viewDate();
    const view = this.currentView();
    if (view === 'month') {
      this.viewDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
    } else if (view === 'year') {
      this.viewDate.set(new Date(d.getFullYear() + 1, d.getMonth(), 1));
    } else {
      this.viewDate.set(new Date(d.getFullYear() + 24, d.getMonth(), 1));
    }
  }

  switchView(): void {
    const view = this.currentView();
    if (view === 'month') this.currentView.set('year');
    else if (view === 'year') this.currentView.set('multi-year');
    else this.currentView.set('month');
  }

  goToToday(): void {
    const today = new Date();
    this.viewDate.set(today);
    this.currentView.set('month');
  }

  onKeydown(e: KeyboardEvent): void {
    // Basic keyboard navigation for calendar
    if (this.currentView() !== 'month') return;
    const sel = this.selected() ?? new Date();
    let newDate: Date | null = null;

    switch (e.key) {
      case 'ArrowLeft':
        newDate = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate() - 1);
        break;
      case 'ArrowRight':
        newDate = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate() + 1);
        break;
      case 'ArrowUp':
        newDate = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate() - 7);
        break;
      case 'ArrowDown':
        newDate = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate() + 7);
        break;
      default:
        return;
    }

    e.preventDefault();
    if (newDate) {
      this.viewDate.set(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
      this.selected.set(newDate);
    }
  }

  private sameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  private startOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  isCurrentYear(year: number): boolean {
    return year === new Date().getFullYear();
  }

  isSelectedYear(year: number): boolean {
    return year === this.viewDate().getFullYear();
  }

  isCurrentMonth(monthIndex: number): boolean {
    const now = new Date();
    const vd = this.viewDate();
    return monthIndex === now.getMonth() && vd.getFullYear() === now.getFullYear();
  }

  isSelectedMonth(monthIndex: number): boolean {
    const vd = this.viewDate();
    const sel = this.selected();
    return sel ? monthIndex === sel.getMonth() && vd.getFullYear() === sel.getFullYear() : false;
  }
}

// ── Datepicker ──

@Component({
  selector: 'hyper-datepicker',
  styleUrl: './datepicker.scss',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="hyper-datepicker-input-wrapper" (click)="toggle()">
      <input
        #inputEl
        class="hyper-datepicker-input"
        type="text"
        [placeholder]="placeholder()"
        [value]="displayValue()"
        [disabled]="disabled()"
        readonly
        [attr.aria-label]="placeholder()"
      />
      <span class="material-icons hyper-datepicker-toggle-icon">calendar_today</span>
    </div>
    @if (isOpen()) {
      <div class="hyper-datepicker-panel">
        <hyper-calendar
          [selected]="value()"
          [color]="color()"
          [firstDayOfWeek]="firstDayOfWeek()"
          [min]="min()"
          [max]="max()"
          [dateFilter]="dateFilter()"
          (selectedChange)="onDateSelected($event)"
        />
      </div>
    }
  `,
  imports: [HyperCalendar],
  host: {
    'class': 'hyper-datepicker',
    '[class.hyper-datepicker-disabled]': 'disabled()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HyperDatepicker),
      multi: true,
    },
  ],
})
export class HyperDatepicker implements ControlValueAccessor, OnDestroy {
  readonly placeholder = input('Selecionar data');
  readonly disabled = input(false);
  readonly min = input<Date | undefined>(undefined);
  readonly max = input<Date | undefined>(undefined);
  readonly dateFilter = input<((date: Date) => boolean) | undefined>(undefined);
  readonly firstDayOfWeek = input(0);
  readonly color = input<'primary' | 'secondary'>('primary');
  readonly format = input('dd/MM/yyyy');

  readonly dateChange = output<Date | null>();

  readonly value = signal<Date | null>(null);
  readonly isOpen = signal(false);

  private readonly doc = inject(DOCUMENT);
  private readonly el = inject(ElementRef);
  private outsideClickListener: ((e: MouseEvent) => void) | null = null;

  readonly displayValue = computed(() => {
    const d = this.value();
    if (!d) return '';
    return this.formatDate(d);
  });

  toggle(): void {
    if (this.disabled()) return;
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.isOpen() || this.disabled()) return;
    this.isOpen.set(true);

    // Close on outside click
    this.outsideClickListener = (e: MouseEvent) => {
      if (!this.el.nativeElement.contains(e.target as Node)) {
        this.close();
      }
    };
    setTimeout(() => {
      this.doc.addEventListener('click', this.outsideClickListener!);
    });
  }

  close(): void {
    this.isOpen.set(false);
    if (this.outsideClickListener) {
      this.doc.removeEventListener('click', this.outsideClickListener);
      this.outsideClickListener = null;
    }
  }

  onDateSelected(date: Date | null): void {
    if (!date) return;
    this.value.set(date);
    this.dateChange.emit(date);
    this.onChange(date);
    this.onTouched();
    this.close();
  }

  ngOnDestroy(): void {
    this.close();
  }

  // ── ControlValueAccessor ──
  private onChange: (val: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: Date | null): void {
    this.value.set(val);
  }

  registerOnChange(fn: (val: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // disabled is an input, managed externally
  }

  private formatDate(d: Date): string {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const fmt = this.format();
    return fmt
      .replace('dd', day)
      .replace('MM', month)
      .replace('yyyy', String(year));
  }
}

// ── Datepicker Toggle ──

@Directive({
  selector: '[hyperDatepickerToggle]',
  host: {
    '(click)': 'datepicker().toggle()',
    'class': 'hyper-datepicker-toggle',
    'style': 'cursor: pointer',
  },
})
export class HyperDatepickerToggle {
  readonly datepicker = input.required<HyperDatepicker>({ alias: 'hyperDatepickerToggle' });
}
