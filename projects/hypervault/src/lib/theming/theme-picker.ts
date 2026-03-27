import { Component, ViewEncapsulation, inject, signal, ElementRef, HostListener } from '@angular/core';
import { HyperThemeService } from './theming';

@Component({
  selector: 'hyper-theme-picker',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './theme-picker.scss',
  template: `
    <div class="hyper-theme-picker">
      <button
        class="hyper-theme-trigger"
        (click)="toggle()"
        type="button"
        aria-label="Selecionar tema">
        <span class="hyper-theme-trigger-swatch">
          <span class="hyper-theme-trigger-color" [style.background]="themeService.darkMode() ? themeService.activeTheme().dark.primary : themeService.activeTheme().light.primary"></span>
          <span class="hyper-theme-trigger-color" [style.background]="themeService.darkMode() ? themeService.activeTheme().dark.secondary : themeService.activeTheme().light.secondary"></span>
        </span>
        <span class="hyper-theme-trigger-label">{{ themeService.activeTheme().label }}</span>
        <span class="material-icons hyper-theme-trigger-arrow">{{ open() ? 'expand_less' : 'expand_more' }}</span>
      </button>

      @if (open()) {
        <div class="hyper-theme-dropdown">
          <div class="hyper-theme-dropdown-header">
            <span class="hyper-theme-dropdown-title">Temas</span>
            <div class="hyper-theme-dropdown-actions">
              <button
                class="hyper-theme-action-btn"
                [class.hyper-theme-action-btn-active]="themeService.highContrast()"
                (click)="themeService.toggleHighContrast()"
                [attr.aria-label]="themeService.highContrast() ? 'Desativar alto contraste' : 'Ativar alto contraste'"
                title="Alto contraste"
                type="button">
                <span class="material-icons">contrast</span>
              </button>
              <button
                class="hyper-theme-action-btn"
                (click)="themeService.toggleDarkMode()"
                [attr.aria-label]="themeService.darkMode() ? 'Modo claro' : 'Modo escuro'"
                type="button">
                <span class="material-icons">{{ themeService.darkMode() ? 'light_mode' : 'dark_mode' }}</span>
              </button>
            </div>
          </div>
          <div class="hyper-theme-grid">
            @for (theme of themeService.themes(); track theme.name) {
              <button
                class="hyper-theme-option"
                [class.hyper-theme-option-active]="themeService.themeName() === theme.name"
                (click)="selectTheme(theme.name)"
                [title]="theme.label"
                type="button">
                <span class="hyper-theme-option-swatch">
                  <span class="hyper-theme-option-color" [style.background]="themeService.darkMode() ? theme.dark.primary : theme.light.primary"></span>
                  <span class="hyper-theme-option-color" [style.background]="themeService.darkMode() ? theme.dark.secondary : theme.light.secondary"></span>
                </span>
                <span class="hyper-theme-option-label">{{ theme.label }}</span>
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  host: { 'class': 'hyper-theme-picker-host' },
})
export class HyperThemePicker {
  readonly themeService = inject(HyperThemeService);
  private readonly el = inject(ElementRef);
  readonly open = signal(false);

  toggle() {
    this.open.update(v => !v);
  }

  selectTheme(name: string) {
    this.themeService.setTheme(name);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.open() && !this.el.nativeElement.contains(event.target)) {
      this.open.set(false);
    }
  }
}
