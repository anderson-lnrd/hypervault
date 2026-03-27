import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HyperBreadcrumb } from 'hypervault/breadcrumb';
import { HyperButton } from 'hypervault/button';
import { HyperIcon } from 'hypervault/icon';
import { HyperPageSummary } from 'hypervault/page-summary';
import { HyperSidenav, HyperSidenavContainer, HyperSidenavContent } from 'hypervault/sidenav';
import { HyperToolbar } from 'hypervault/toolbar';
import { HyperThemePicker } from 'hypervault/theming';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_ITEMS: (NavItem | NavGroup)[] = [
  { label: 'Overview', route: '/', icon: 'home' },
  { label: 'Getting Started', route: '/getting-started', icon: 'rocket_launch' },
  {
    title: 'Fundacao', items: [
      { label: 'Cores', route: '/colors', icon: 'palette' },
      { label: 'Tipografia', route: '/typography', icon: 'text_format' },
      { label: 'Theming', route: '/theming', icon: 'color_lens' },
    ]
  },
  {
    title: 'Formularios', items: [
      { label: 'Form Field', route: '/form-field', icon: 'text_fields' },
      { label: 'Checkbox', route: '/checkbox', icon: 'check_box' },
      { label: 'Switch', route: '/switch', icon: 'toggle_on' },
      { label: 'Slider', route: '/slider', icon: 'tune' },
      { label: 'Radio', route: '/radio', icon: 'radio_button_checked' },
      { label: 'Select', route: '/select', icon: 'arrow_drop_down_circle' },
      { label: 'Datepicker', route: '/datepicker', icon: 'date_range' },
      { label: 'Chip', route: '/chip', icon: 'label' },
    ]
  },
  {
    title: 'Acoes', items: [
      { label: 'Button', route: '/button', icon: 'smart_button' },
      { label: 'Menu', route: '/menu', icon: 'menu' },
      { label: 'Tooltip', route: '/tooltip', icon: 'chat_bubble_outline' },
    ]
  },
  {
    title: 'Layout', items: [
      { label: 'Toolbar', route: '/toolbar', icon: 'web' },
      { label: 'Sidenav', route: '/sidenav', icon: 'menu_open' },
      { label: 'Breadcrumb', route: '/breadcrumb', icon: 'chevron_right' },
      { label: 'Tabs', route: '/tabs', icon: 'tab' },
      { label: 'Stepper', route: '/stepper', icon: 'linear_scale' },
      { label: 'Divider', route: '/divider', icon: 'horizontal_rule' },
    ]
  },
  {
    title: 'Dados', items: [
      { label: 'Badge', route: '/badge', icon: 'sell' },
      { label: 'List', route: '/list', icon: 'list' },
      { label: 'Table', route: '/table', icon: 'table_chart' },
      { label: 'Paginator', route: '/paginator', icon: 'last_page' },
      { label: 'Tree', route: '/tree', icon: 'account_tree' },
      { label: 'Accordion', route: '/accordion', icon: 'expand_circle_down' },
    ]
  },
  {
    title: 'Utilitarios', items: [
      { label: 'Page Summary', route: '/page-summary', icon: 'toc' },
    ]
  },
  {
    title: 'Feedback', items: [
      { label: 'Alert', route: '/alert', icon: 'notification_important' },
      { label: 'Snackbar', route: '/snackbar', icon: 'chat_bubble' },
      { label: 'Dialog', route: '/dialog', icon: 'open_in_new' },
      { label: 'Progress', route: '/progress', icon: 'hourglass_top' },
    ]
  },
];

function isGroup(item: NavItem | NavGroup): item is NavGroup {
  return 'title' in item;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    HyperBreadcrumb,
    HyperButton,
    HyperIcon,
    HyperSidenavContainer,
    HyperSidenav,
    HyperSidenavContent,
    HyperToolbar,
    HyperThemePicker,
    HyperPageSummary,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly router = inject(Router);

  sidenavOpened = true;
  searchQuery = signal('');

  // Pages where the sticky TOC should NOT appear
  private readonly EXCLUDED_ROUTES = ['/', '/page-summary'];

  // Signal updated on NavigationEnd to make showDocSummary reactive
  private readonly navUrl = signal(this.router.url);

  readonly showDocSummary = computed(() => {
    const path = this.navUrl().split('?')[0].split('#')[0];
    return !this.EXCLUDED_ROUTES.includes(path);
  });

  filteredNav = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return NAV_ITEMS;

    const result: (NavItem | NavGroup)[] = [];
    for (const entry of NAV_ITEMS) {
      if (isGroup(entry)) {
        const filtered = entry.items.filter(i => i.label.toLowerCase().includes(q));
        if (filtered.length) {
          result.push({ title: entry.title, items: filtered });
        }
      } else {
        if (entry.label.toLowerCase().includes(q)) {
          result.push(entry);
        }
      }
    }
    return result;
  });

  isGroup = isGroup;

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.navUrl.set(this.router.url);
        const fragment = this.router.parseUrl(this.router.url).fragment;
        if (!fragment) return;
        setTimeout(() => {
          const el = document.getElementById(fragment);
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 96; // 6rem offset
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 150);
      });
  }

  clearSearch() {
    this.searchQuery.set('');
  }
}
