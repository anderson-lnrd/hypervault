import {
  Directive,
  InjectionToken,
  input,
  Provider,
} from '@angular/core';

/**
 * Density scale: 0 (default) to -4 (most compact).
 * Each step reduces component sizing proportionally.
 */
export type HyperDensity = 0 | -1 | -2 | -3 | -4;

export const HYPER_DENSITY = new InjectionToken<HyperDensity>('HYPER_DENSITY');

/** Provide a default density for the application or a sub-tree. */
export function provideHyperDensity(density: HyperDensity): Provider {
  return { provide: HYPER_DENSITY, useValue: density };
}

/**
 * Directive to set density on a container via CSS custom property.
 * Usage: <div [hyperDensity]="-2"> ... components inside inherit the density ... </div>
 */
@Directive({
  selector: '[hyperDensity]',
  host: {
    '[style.--hyper-density]': 'hyperDensity()',
  },
})
export class HyperDensityDirective {
  readonly hyperDensity = input.required<HyperDensity>();
}
