import {
  Component,
  ContentChildren,
  Directive,
  QueryList,
  AfterContentInit,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

// ── Step Label (custom template) ──

@Directive({ selector: '[hyperStepLabel]' })
export class HyperStepLabel {
  readonly template = inject(TemplateRef);
}

// ── Step ──

@Component({
  selector: 'hyper-step',
  template: `<ng-template #body><ng-content /></ng-template>`,
  host: { 'style': 'display: none' },
})
export class HyperStep {
  readonly label = input('');
  readonly icon = input<string | undefined>(undefined);
  readonly completed = signal(false);
  readonly editable = input(true);
  readonly optional = input(false);
  readonly hasError = input(false);
  readonly errorMessage = input('');
  readonly disabled = input(false);
  readonly active = signal(false);

  @ViewChild('body', { static: true }) _bodyTpl!: TemplateRef<any>;

  /** @internal */
  _index = 0;
}

// ── Stepper Previous / Next ──

@Directive({
  selector: '[hyperStepperPrevious]',
  host: { '(click)': '_stepper.previous()' },
})
export class HyperStepperPrevious {
  readonly _stepper = inject(HyperStepper);
}

@Directive({
  selector: '[hyperStepperNext]',
  host: { '(click)': '_stepper.next()' },
})
export class HyperStepperNext {
  readonly _stepper = inject(HyperStepper);
}

// ── Stepper ──

@Component({
  selector: 'hyper-stepper',
  styleUrl: './stepper.scss',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './stepper.html',
  imports: [NgTemplateOutlet],
  host: {
    'class': 'hyper-stepper',
    '[class.hyper-stepper-horizontal]': "orientation() === 'horizontal'",
    '[class.hyper-stepper-vertical]': "orientation() === 'vertical'",
    '[class.hyper-stepper-secondary]': "color() === 'secondary'",
  },
})
export class HyperStepper implements AfterContentInit {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly linear = input(false);
  readonly color = input<'primary' | 'secondary'>('primary');
  readonly labelPosition = input<'bottom' | 'end'>('bottom');
  readonly selectedIndex = signal(0);
  readonly selectionChange = output<{ selectedIndex: number; previousIndex: number }>();

  @ContentChildren(HyperStep) steps!: QueryList<HyperStep>;

  ngAfterContentInit(): void {
    this.updateStepIndices();
    this.activateStep(this.selectedIndex());
    this.steps.changes.subscribe(() => {
      this.updateStepIndices();
      this.activateStep(this.selectedIndex());
    });
  }

  private updateStepIndices(): void {
    this.steps.forEach((step, i) => step._index = i);
  }

  selectStep(index: number): void {
    if (index < 0 || index >= this.steps.length) return;

    const step = this.steps.get(index);
    if (step?.disabled()) return;

    const prev = this.selectedIndex();
    if (prev === index) return;

    // In linear mode, can only advance one step at a time (no skipping via header click)
    if (this.linear() && index > prev + 1) {
      return;
    }

    // Mark previous step as completed when advancing
    if (index > prev) {
      const prevStep = this.steps.get(prev);
      if (prevStep) {
        prevStep.completed.set(true);
      }
    }

    this.selectedIndex.set(index);
    this.activateStep(index);
    this.selectionChange.emit({ selectedIndex: index, previousIndex: prev });
  }

  next(): void {
    this.selectStep(this.selectedIndex() + 1);
  }

  previous(): void {
    this.selectStep(this.selectedIndex() - 1);
  }

  reset(): void {
    this.steps.forEach(s => {
      s.completed.set(false);
      s.active.set(false);
    });
    this.selectedIndex.set(0);
    this.activateStep(0);
  }

  private activateStep(index: number): void {
    this.steps?.forEach((step, i) => step.active.set(i === index));
  }
}
