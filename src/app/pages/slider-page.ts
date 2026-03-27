import { Component } from '@angular/core';
import { HyperSlider } from 'hypervault/slider';
@Component({
  selector: 'app-slider-page',
  imports: [HyperSlider],
  templateUrl: './slider-page.html',
})
export class SliderPage {
  volume = 47;
  brightness = 80;
}
