import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HyperCalendar, HyperDatepicker } from './datepicker';

describe('HyperCalendar', () => {
  let fixture: ComponentFixture<HyperCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HyperCalendar],
    }).compileComponents();

    fixture = TestBed.createComponent(HyperCalendar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});

describe('HyperDatepicker', () => {
  let fixture: ComponentFixture<HyperDatepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HyperDatepicker],
    }).compileComponents();

    fixture = TestBed.createComponent(HyperDatepicker);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
