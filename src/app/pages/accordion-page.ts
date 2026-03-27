import { Component } from '@angular/core';
import { HyperAccordion, HyperExpansionPanel, HyperAccordionHeader } from 'hypervault/accordion';
@Component({
  selector: 'app-accordion-page',
  imports: [HyperAccordion, HyperExpansionPanel, HyperAccordionHeader],
  templateUrl: './accordion-page.html',
})
export class AccordionPage {}
