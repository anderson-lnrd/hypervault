import { Component } from '@angular/core';
import { HyperBreadcrumb, HyperBreadcrumbItem } from 'hypervault/breadcrumb';
@Component({
  selector: 'app-breadcrumb-page',
  imports: [HyperBreadcrumb],
  templateUrl: './breadcrumb-page.html',
})
export class BreadcrumbPage {
  readonly manualItems: HyperBreadcrumbItem[] = [
    { label: 'Home', url: '/', icon: 'home' },
    { label: 'Categorias', url: '/categorias' },
    { label: 'Perifericos', url: '/categorias/perifericos' },
    { label: 'Teclados', url: '/categorias/perifericos/teclados' },
  ];

  readonly simpleItems: HyperBreadcrumbItem[] = [
    { label: 'Loja', url: '/' },
    { label: 'Produtos', url: '/produtos' },
    { label: 'Detalhes', url: '/produtos/123' },
  ];

  readonly anchorItems: HyperBreadcrumbItem[] = [
    { label: 'Topo', url: '/breadcrumb', fragment: 'topo', icon: 'vertical_align_top' },
    { label: 'Modo Automatico', url: '/breadcrumb', fragment: 'modo-automatico' },
    { label: 'Modo Manual', url: '/breadcrumb', fragment: 'modo-manual' },
    { label: 'Separadores', url: '/breadcrumb', fragment: 'separadores' },
    { label: 'Ancoras', url: '/breadcrumb', fragment: 'ancoras' },
    { label: 'API', url: '/breadcrumb', fragment: 'api' },
  ];
}
