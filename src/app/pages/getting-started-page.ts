import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HyperBadge } from 'hypervault/badge';

@Component({
  selector: 'app-getting-started-page',
  imports: [RouterLink, HyperBadge],
  templateUrl: './getting-started-page.html',
})
export class GettingStartedPage {}
