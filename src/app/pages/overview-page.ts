import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HyperBadge } from 'hypervault/badge';
import { HyperButton } from 'hypervault/button';
import { HyperIcon } from 'hypervault/icon';
import { HyperCheckbox } from 'hypervault/checkbox';
import { HyperSwitch } from 'hypervault/switch';
import { HyperSlider } from 'hypervault/slider';
import { HyperChip, HyperChipSet } from 'hypervault/chip';
import { HyperProgressBar } from 'hypervault/progress-bar';
import { HyperSpinner } from 'hypervault/spinner';
import { HyperDivider } from 'hypervault/divider';
@Component({
  selector: 'app-overview-page',
  imports: [
    RouterLink,
    HyperBadge,
    HyperButton,
    HyperIcon,
    HyperCheckbox,
    HyperSwitch,
    HyperSlider,
    HyperChip,
    HyperChipSet,
    HyperProgressBar,
    HyperSpinner,
    HyperDivider,
  ],
  templateUrl: './overview-page.html',
})
export class OverviewPage {}
