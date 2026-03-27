import { InjectionToken, Provider } from '@angular/core';

import type { HyperButtonColor, HyperButtonSize } from '../button/button';
import type { HyperCheckboxColor } from '../checkbox/checkbox';
import type { HyperSwitchColor } from '../switch/switch';
import type { HyperToolbarColor, HyperToolbarSize } from '../toolbar/toolbar';

export interface HyperButtonDefaults {
  color?: HyperButtonColor;
  size?: HyperButtonSize;
}

export interface HyperCheckboxDefaults {
  color?: HyperCheckboxColor;
}

export interface HyperSwitchDefaults {
  color?: HyperSwitchColor;
}

export interface HyperToolbarDefaults {
  color?: HyperToolbarColor;
  size?: HyperToolbarSize;
  bordered?: boolean;
  elevated?: boolean;
  dense?: boolean;
  sticky?: boolean;
}

export interface HyperDefaults {
  button?: HyperButtonDefaults;
  checkbox?: HyperCheckboxDefaults;
  switch?: HyperSwitchDefaults;
  toolbar?: HyperToolbarDefaults;
}

export const HYPER_DEFAULTS = new InjectionToken<HyperDefaults>('HYPER_DEFAULTS');

export function provideHyperDefaults(config: HyperDefaults): Provider {
  return {
    provide: HYPER_DEFAULTS,
    useValue: config,
  };
}
