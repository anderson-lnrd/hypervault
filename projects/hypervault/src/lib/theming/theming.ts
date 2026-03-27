import { Injectable, inject, signal, computed, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// ── Theme Token Interface ──

export interface HyperThemeTokens {
  background: string;
  foreground: string;
  card: string;
  muted: string;
  'muted-foreground': string;
  input: string;
  border: string;
  primary: string;
  'primary-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  accent: string;
  'accent-foreground': string;
  destructive: string;
  'destructive-foreground': string;
}

export interface HyperThemeDefinition {
  name: string;
  label: string;
  dark: HyperThemeTokens;
  light: HyperThemeTokens;
}

// ── Built-in Themes ──

export const HYPER_THEMES: HyperThemeDefinition[] = [
  {
    name: 'cyber',
    label: 'Cyber',
    dark: {
      background: '#0f0f0f',
      foreground: '#fafafa',
      card: '#1a1a1a',
      muted: '#2a2a2a',
      'muted-foreground': '#a3a3a3',
      input: '#242424',
      border: '#fafafa',
      primary: '#39ff14',
      'primary-foreground': '#0f0f0f',
      secondary: '#ff1493',
      'secondary-foreground': '#0f0f0f',
      accent: '#ffff00',
      'accent-foreground': '#0f0f0f',
      destructive: '#ff4444',
      'destructive-foreground': '#fafafa',
    },
    light: {
      background: '#f5f5f0',
      foreground: '#1a1a1a',
      card: '#ffffff',
      muted: '#e8e8e0',
      'muted-foreground': '#6b6b6b',
      input: '#ffffff',
      border: '#1a1a1a',
      primary: '#16a34a',
      'primary-foreground': '#ffffff',
      secondary: '#db2777',
      'secondary-foreground': '#ffffff',
      accent: '#ca8a04',
      'accent-foreground': '#ffffff',
      destructive: '#dc2626',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'ocean',
    label: 'Ocean',
    dark: {
      background: '#0a1628',
      foreground: '#e2e8f0',
      card: '#1e293b',
      muted: '#334155',
      'muted-foreground': '#94a3b8',
      input: '#1e293b',
      border: '#e2e8f0',
      primary: '#38bdf8',
      'primary-foreground': '#0a1628',
      secondary: '#a78bfa',
      'secondary-foreground': '#0a1628',
      accent: '#2dd4bf',
      'accent-foreground': '#0a1628',
      destructive: '#f87171',
      'destructive-foreground': '#fafafa',
    },
    light: {
      background: '#f0f9ff',
      foreground: '#0f172a',
      card: '#ffffff',
      muted: '#e0f2fe',
      'muted-foreground': '#64748b',
      input: '#ffffff',
      border: '#0f172a',
      primary: '#0284c7',
      'primary-foreground': '#ffffff',
      secondary: '#7c3aed',
      'secondary-foreground': '#ffffff',
      accent: '#0d9488',
      'accent-foreground': '#ffffff',
      destructive: '#dc2626',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'sunset',
    label: 'Sunset',
    dark: {
      background: '#1c1017',
      foreground: '#fae8e8',
      card: '#2a1a22',
      muted: '#3d2533',
      'muted-foreground': '#b09098',
      input: '#2a1a22',
      border: '#fae8e8',
      primary: '#fb923c',
      'primary-foreground': '#1c1017',
      secondary: '#f472b6',
      'secondary-foreground': '#1c1017',
      accent: '#fbbf24',
      'accent-foreground': '#1c1017',
      destructive: '#ef4444',
      'destructive-foreground': '#fafafa',
    },
    light: {
      background: '#fef7ee',
      foreground: '#1c1017',
      card: '#ffffff',
      muted: '#fee2c5',
      'muted-foreground': '#78716c',
      input: '#ffffff',
      border: '#1c1017',
      primary: '#ea580c',
      'primary-foreground': '#ffffff',
      secondary: '#e11d48',
      'secondary-foreground': '#ffffff',
      accent: '#d97706',
      'accent-foreground': '#ffffff',
      destructive: '#dc2626',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'vapor',
    label: 'Vapor',
    dark: {
      background: '#0f0a1a',
      foreground: '#ede9fe',
      card: '#1a1130',
      muted: '#2e1f5e',
      'muted-foreground': '#a598d4',
      input: '#1a1130',
      border: '#ede9fe',
      primary: '#c084fc',
      'primary-foreground': '#0f0a1a',
      secondary: '#22d3ee',
      'secondary-foreground': '#0f0a1a',
      accent: '#f0abfc',
      'accent-foreground': '#0f0a1a',
      destructive: '#fb7185',
      'destructive-foreground': '#fafafa',
    },
    light: {
      background: '#faf5ff',
      foreground: '#1e1b4b',
      card: '#ffffff',
      muted: '#f3e8ff',
      'muted-foreground': '#6b7280',
      input: '#ffffff',
      border: '#1e1b4b',
      primary: '#9333ea',
      'primary-foreground': '#ffffff',
      secondary: '#0891b2',
      'secondary-foreground': '#ffffff',
      accent: '#c026d3',
      'accent-foreground': '#ffffff',
      destructive: '#e11d48',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'mono',
    label: 'Mono',
    dark: {
      background: '#0a0a0a',
      foreground: '#e5e5e5',
      card: '#171717',
      muted: '#262626',
      'muted-foreground': '#a3a3a3',
      input: '#171717',
      border: '#e5e5e5',
      primary: '#e5e5e5',
      'primary-foreground': '#0a0a0a',
      secondary: '#a3a3a3',
      'secondary-foreground': '#0a0a0a',
      accent: '#d4d4d4',
      'accent-foreground': '#0a0a0a',
      destructive: '#ef4444',
      'destructive-foreground': '#fafafa',
    },
    light: {
      background: '#fafafa',
      foreground: '#171717',
      card: '#ffffff',
      muted: '#e5e5e5',
      'muted-foreground': '#737373',
      input: '#ffffff',
      border: '#171717',
      primary: '#171717',
      'primary-foreground': '#fafafa',
      secondary: '#525252',
      'secondary-foreground': '#fafafa',
      accent: '#404040',
      'accent-foreground': '#fafafa',
      destructive: '#dc2626',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'mocha',
    label: 'Mocha',
    dark: {
      background: '#272822',
      foreground: '#f8f8f2',
      card: '#2d2e27',
      muted: '#3e3d32',
      'muted-foreground': '#75715e',
      input: '#2d2e27',
      border: '#f8f8f2',
      primary: '#a6e22e',
      'primary-foreground': '#272822',
      secondary: '#66d9ef',
      'secondary-foreground': '#272822',
      accent: '#fd971f',
      'accent-foreground': '#272822',
      destructive: '#f92672',
      'destructive-foreground': '#f8f8f2',
    },
    light: {
      background: '#fdf6e3',
      foreground: '#3e3d32',
      card: '#ffffff',
      muted: '#eee8d5',
      'muted-foreground': '#75715e',
      input: '#ffffff',
      border: '#3e3d32',
      primary: '#718c00',
      'primary-foreground': '#ffffff',
      secondary: '#2aa198',
      'secondary-foreground': '#ffffff',
      accent: '#cb4b16',
      'accent-foreground': '#ffffff',
      destructive: '#dc322f',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'dracula',
    label: 'Dracula',
    dark: {
      background: '#282a36',
      foreground: '#f8f8f2',
      card: '#2c2f3a',
      muted: '#44475a',
      'muted-foreground': '#6272a4',
      input: '#2c2f3a',
      border: '#f8f8f2',
      primary: '#bd93f9',
      'primary-foreground': '#282a36',
      secondary: '#ff79c6',
      'secondary-foreground': '#282a36',
      accent: '#50fa7b',
      'accent-foreground': '#282a36',
      destructive: '#ff5555',
      'destructive-foreground': '#f8f8f2',
    },
    light: {
      background: '#f8f8f2',
      foreground: '#282a36',
      card: '#ffffff',
      muted: '#e8e8e2',
      'muted-foreground': '#6272a4',
      input: '#ffffff',
      border: '#282a36',
      primary: '#7c3aed',
      'primary-foreground': '#ffffff',
      secondary: '#db2777',
      'secondary-foreground': '#ffffff',
      accent: '#16a34a',
      'accent-foreground': '#ffffff',
      destructive: '#dc2626',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'nord',
    label: 'Nord',
    dark: {
      background: '#2e3440',
      foreground: '#eceff4',
      card: '#3b4252',
      muted: '#434c5e',
      'muted-foreground': '#d8dee9',
      input: '#3b4252',
      border: '#eceff4',
      primary: '#88c0d0',
      'primary-foreground': '#2e3440',
      secondary: '#81a1c1',
      'secondary-foreground': '#2e3440',
      accent: '#ebcb8b',
      'accent-foreground': '#2e3440',
      destructive: '#bf616a',
      'destructive-foreground': '#eceff4',
    },
    light: {
      background: '#eceff4',
      foreground: '#2e3440',
      card: '#ffffff',
      muted: '#d8dee9',
      'muted-foreground': '#4c566a',
      input: '#ffffff',
      border: '#2e3440',
      primary: '#5e81ac',
      'primary-foreground': '#ffffff',
      secondary: '#5e81ac',
      'secondary-foreground': '#ffffff',
      accent: '#d08770',
      'accent-foreground': '#ffffff',
      destructive: '#bf616a',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'gruvbox',
    label: 'Gruvbox',
    dark: {
      background: '#282828',
      foreground: '#ebdbb2',
      card: '#3c3836',
      muted: '#504945',
      'muted-foreground': '#a89984',
      input: '#3c3836',
      border: '#ebdbb2',
      primary: '#fabd2f',
      'primary-foreground': '#282828',
      secondary: '#83a598',
      'secondary-foreground': '#282828',
      accent: '#fe8019',
      'accent-foreground': '#282828',
      destructive: '#fb4934',
      'destructive-foreground': '#ebdbb2',
    },
    light: {
      background: '#fbf1c7',
      foreground: '#3c3836',
      card: '#ffffff',
      muted: '#ebdbb2',
      'muted-foreground': '#7c6f64',
      input: '#ffffff',
      border: '#3c3836',
      primary: '#b57614',
      'primary-foreground': '#ffffff',
      secondary: '#427b58',
      'secondary-foreground': '#ffffff',
      accent: '#af3a03',
      'accent-foreground': '#ffffff',
      destructive: '#cc241d',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'tokyo-night',
    label: 'Tokyo Night',
    dark: {
      background: '#1a1b26',
      foreground: '#c0caf5',
      card: '#24283b',
      muted: '#2f3549',
      'muted-foreground': '#565f89',
      input: '#24283b',
      border: '#c0caf5',
      primary: '#7aa2f7',
      'primary-foreground': '#1a1b26',
      secondary: '#bb9af7',
      'secondary-foreground': '#1a1b26',
      accent: '#7dcfff',
      'accent-foreground': '#1a1b26',
      destructive: '#f7768e',
      'destructive-foreground': '#c0caf5',
    },
    light: {
      background: '#d5d6db',
      foreground: '#343b58',
      card: '#ffffff',
      muted: '#c4c5cb',
      'muted-foreground': '#565f89',
      input: '#ffffff',
      border: '#343b58',
      primary: '#34548a',
      'primary-foreground': '#ffffff',
      secondary: '#5a3e8e',
      'secondary-foreground': '#ffffff',
      accent: '#166775',
      'accent-foreground': '#ffffff',
      destructive: '#8c4351',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'rose-pine',
    label: 'Rosé Pine',
    dark: {
      background: '#191724',
      foreground: '#e0def4',
      card: '#1f1d2e',
      muted: '#26233a',
      'muted-foreground': '#6e6a86',
      input: '#1f1d2e',
      border: '#e0def4',
      primary: '#c4a7e7',
      'primary-foreground': '#191724',
      secondary: '#ebbcba',
      'secondary-foreground': '#191724',
      accent: '#f6c177',
      'accent-foreground': '#191724',
      destructive: '#eb6f92',
      'destructive-foreground': '#e0def4',
    },
    light: {
      background: '#faf4ed',
      foreground: '#575279',
      card: '#fffaf3',
      muted: '#f2e9de',
      'muted-foreground': '#9893a5',
      input: '#fffaf3',
      border: '#575279',
      primary: '#907aa9',
      'primary-foreground': '#ffffff',
      secondary: '#d7827e',
      'secondary-foreground': '#ffffff',
      accent: '#ea9d34',
      'accent-foreground': '#ffffff',
      destructive: '#b4637a',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'synthwave',
    label: 'Synthwave',
    dark: {
      background: '#1a1028',
      foreground: '#f0e6ff',
      card: '#241b36',
      muted: '#2e2244',
      'muted-foreground': '#8673a1',
      input: '#241b36',
      border: '#f0e6ff',
      primary: '#ff7edb',
      'primary-foreground': '#1a1028',
      secondary: '#36f9f6',
      'secondary-foreground': '#1a1028',
      accent: '#fede5d',
      'accent-foreground': '#1a1028',
      destructive: '#fe4450',
      'destructive-foreground': '#f0e6ff',
    },
    light: {
      background: '#faf0ff',
      foreground: '#2a1b3d',
      card: '#ffffff',
      muted: '#f0e0fa',
      'muted-foreground': '#6b5a7d',
      input: '#ffffff',
      border: '#2a1b3d',
      primary: '#c6208e',
      'primary-foreground': '#ffffff',
      secondary: '#0e8a87',
      'secondary-foreground': '#ffffff',
      accent: '#b3930d',
      'accent-foreground': '#ffffff',
      destructive: '#c41230',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'catppuccin',
    label: 'Catppuccin',
    dark: {
      background: '#1e1e2e',
      foreground: '#cdd6f4',
      card: '#24243b',
      muted: '#313244',
      'muted-foreground': '#a6adc8',
      input: '#24243b',
      border: '#cdd6f4',
      primary: '#cba6f7',
      'primary-foreground': '#1e1e2e',
      secondary: '#f38ba8',
      'secondary-foreground': '#1e1e2e',
      accent: '#a6e3a1',
      'accent-foreground': '#1e1e2e',
      destructive: '#f38ba8',
      'destructive-foreground': '#1e1e2e',
    },
    light: {
      background: '#eff1f5',
      foreground: '#4c4f69',
      card: '#ffffff',
      muted: '#dce0e8',
      'muted-foreground': '#6c6f85',
      input: '#ffffff',
      border: '#4c4f69',
      primary: '#8839ef',
      'primary-foreground': '#ffffff',
      secondary: '#d20f39',
      'secondary-foreground': '#ffffff',
      accent: '#40a02b',
      'accent-foreground': '#ffffff',
      destructive: '#d20f39',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'solarized',
    label: 'Solarized',
    dark: {
      background: '#002b36',
      foreground: '#93a1a1',
      card: '#073642',
      muted: '#0a3f4e',
      'muted-foreground': '#586e75',
      input: '#073642',
      border: '#93a1a1',
      primary: '#268bd2',
      'primary-foreground': '#002b36',
      secondary: '#2aa198',
      'secondary-foreground': '#002b36',
      accent: '#b58900',
      'accent-foreground': '#002b36',
      destructive: '#dc322f',
      'destructive-foreground': '#93a1a1',
    },
    light: {
      background: '#fdf6e3',
      foreground: '#657b83',
      card: '#ffffff',
      muted: '#eee8d5',
      'muted-foreground': '#93a1a1',
      input: '#ffffff',
      border: '#586e75',
      primary: '#268bd2',
      'primary-foreground': '#ffffff',
      secondary: '#2aa198',
      'secondary-foreground': '#ffffff',
      accent: '#b58900',
      'accent-foreground': '#ffffff',
      destructive: '#dc322f',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'one-dark',
    label: 'One Dark',
    dark: {
      background: '#282c34',
      foreground: '#abb2bf',
      card: '#2c313a',
      muted: '#3e4451',
      'muted-foreground': '#5c6370',
      input: '#2c313a',
      border: '#abb2bf',
      primary: '#61afef',
      'primary-foreground': '#282c34',
      secondary: '#c678dd',
      'secondary-foreground': '#282c34',
      accent: '#e5c07b',
      'accent-foreground': '#282c34',
      destructive: '#e06c75',
      'destructive-foreground': '#abb2bf',
    },
    light: {
      background: '#fafafa',
      foreground: '#383a42',
      card: '#ffffff',
      muted: '#e5e5e6',
      'muted-foreground': '#a0a1a7',
      input: '#ffffff',
      border: '#383a42',
      primary: '#4078f2',
      'primary-foreground': '#ffffff',
      secondary: '#a626a4',
      'secondary-foreground': '#ffffff',
      accent: '#c18401',
      'accent-foreground': '#ffffff',
      destructive: '#e45649',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'matrix',
    label: 'Matrix',
    dark: {
      background: '#0d0d0d',
      foreground: '#00ff41',
      card: '#141414',
      muted: '#1a1a1a',
      'muted-foreground': '#00802b',
      input: '#141414',
      border: '#00ff41',
      primary: '#00ff41',
      'primary-foreground': '#0d0d0d',
      secondary: '#008f11',
      'secondary-foreground': '#0d0d0d',
      accent: '#00ff41',
      'accent-foreground': '#0d0d0d',
      destructive: '#ff0040',
      'destructive-foreground': '#00ff41',
    },
    light: {
      background: '#f0fff0',
      foreground: '#0a2e14',
      card: '#ffffff',
      muted: '#d4f5d4',
      'muted-foreground': '#2d6b3f',
      input: '#ffffff',
      border: '#0a2e14',
      primary: '#0a6b2a',
      'primary-foreground': '#ffffff',
      secondary: '#14532d',
      'secondary-foreground': '#ffffff',
      accent: '#16a34a',
      'accent-foreground': '#ffffff',
      destructive: '#dc2626',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'cyberpunk',
    label: 'Cyberpunk',
    dark: {
      background: '#000000',
      foreground: '#f0ecf4',
      card: '#0a0810',
      muted: '#160e1c',
      'muted-foreground': '#880425',
      input: '#0a0810',
      border: '#c5003c',
      primary: '#c5003c',
      'primary-foreground': '#f0ecf4',
      secondary: '#55ead4',
      'secondary-foreground': '#000000',
      accent: '#f3e600',
      'accent-foreground': '#000000',
      destructive: '#880425',
      'destructive-foreground': '#f0ecf4',
    },
    light: {
      background: '#faf5f7',
      foreground: '#1a0a10',
      card: '#ffffff',
      muted: '#f0dce4',
      'muted-foreground': '#880425',
      input: '#ffffff',
      border: '#1a0a10',
      primary: '#c5003c',
      'primary-foreground': '#ffffff',
      secondary: '#0e8a7a',
      'secondary-foreground': '#ffffff',
      accent: '#a89c00',
      'accent-foreground': '#ffffff',
      destructive: '#880425',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'holo-hud',
    label: 'Holo HUD',
    dark: {
      background: '#0a1929',
      foreground: '#cce5ff',
      card: '#0f2440',
      muted: '#163057',
      'muted-foreground': '#5a9fd4',
      input: '#0f2440',
      border: '#00b4d8',
      primary: '#00b4d8',
      'primary-foreground': '#0a1929',
      secondary: '#90e0ef',
      'secondary-foreground': '#0a1929',
      accent: '#f77f00',
      'accent-foreground': '#0a1929',
      destructive: '#ff4444',
      'destructive-foreground': '#cce5ff',
    },
    light: {
      background: '#f0f8ff',
      foreground: '#0a1929',
      card: '#ffffff',
      muted: '#d6eeff',
      'muted-foreground': '#3a7ca5',
      input: '#ffffff',
      border: '#0a1929',
      primary: '#0077b6',
      'primary-foreground': '#ffffff',
      secondary: '#0096c7',
      'secondary-foreground': '#ffffff',
      accent: '#e36500',
      'accent-foreground': '#ffffff',
      destructive: '#dc2626',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'wasteland',
    label: 'Wasteland',
    dark: {
      background: '#0c0c08',
      foreground: '#14fe00',
      card: '#121210',
      muted: '#1a1a14',
      'muted-foreground': '#0b8a00',
      input: '#121210',
      border: '#14fe00',
      primary: '#14fe00',
      'primary-foreground': '#0c0c08',
      secondary: '#0b8a00',
      'secondary-foreground': '#0c0c08',
      accent: '#ffb000',
      'accent-foreground': '#0c0c08',
      destructive: '#ff3333',
      'destructive-foreground': '#14fe00',
    },
    light: {
      background: '#f0f4e8',
      foreground: '#1a2010',
      card: '#ffffff',
      muted: '#d8e4c4',
      'muted-foreground': '#4a5a30',
      input: '#ffffff',
      border: '#1a2010',
      primary: '#2d7a0f',
      'primary-foreground': '#ffffff',
      secondary: '#1a5a00',
      'secondary-foreground': '#ffffff',
      accent: '#b37a00',
      'accent-foreground': '#ffffff',
      destructive: '#cc2222',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'red-sight',
    label: 'Red Sight',
    dark: {
      background: '#0a0000',
      foreground: '#ff3333',
      card: '#140000',
      muted: '#1e0000',
      'muted-foreground': '#801a1a',
      input: '#140000',
      border: '#ff0000',
      primary: '#ff0000',
      'primary-foreground': '#0a0000',
      secondary: '#cc0000',
      'secondary-foreground': '#ffffff',
      accent: '#ffffff',
      'accent-foreground': '#0a0000',
      destructive: '#ff4444',
      'destructive-foreground': '#0a0000',
    },
    light: {
      background: '#fff0f0',
      foreground: '#2a0a0a',
      card: '#ffffff',
      muted: '#ffd6d6',
      'muted-foreground': '#993333',
      input: '#ffffff',
      border: '#2a0a0a',
      primary: '#cc0000',
      'primary-foreground': '#ffffff',
      secondary: '#8b0000',
      'secondary-foreground': '#ffffff',
      accent: '#333333',
      'accent-foreground': '#ffffff',
      destructive: '#b91c1c',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'starship',
    label: 'Starship',
    dark: {
      background: '#1a1025',
      foreground: '#eee0ff',
      card: '#231530',
      muted: '#2e1e3e',
      'muted-foreground': '#9980b3',
      input: '#231530',
      border: '#eee0ff',
      primary: '#ff9900',
      'primary-foreground': '#1a1025',
      secondary: '#cc99ff',
      'secondary-foreground': '#1a1025',
      accent: '#ff5555',
      'accent-foreground': '#1a1025',
      destructive: '#ff3333',
      'destructive-foreground': '#eee0ff',
    },
    light: {
      background: '#f5f0fa',
      foreground: '#1a1025',
      card: '#ffffff',
      muted: '#e8d8f5',
      'muted-foreground': '#5c4670',
      input: '#ffffff',
      border: '#1a1025',
      primary: '#cc7a00',
      'primary-foreground': '#ffffff',
      secondary: '#7a4db3',
      'secondary-foreground': '#ffffff',
      accent: '#cc3333',
      'accent-foreground': '#ffffff',
      destructive: '#b91c1c',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'the-grid',
    label: 'The Grid',
    dark: {
      background: '#050510',
      foreground: '#e0f7ff',
      card: '#0a0a1a',
      muted: '#101025',
      'muted-foreground': '#3a7a8a',
      input: '#0a0a1a',
      border: '#00dffc',
      primary: '#00dffc',
      'primary-foreground': '#050510',
      secondary: '#ff4500',
      'secondary-foreground': '#050510',
      accent: '#ffffff',
      'accent-foreground': '#050510',
      destructive: '#ff2200',
      'destructive-foreground': '#e0f7ff',
    },
    light: {
      background: '#f0fbff',
      foreground: '#0a1520',
      card: '#ffffff',
      muted: '#d4f0fa',
      'muted-foreground': '#3a6a7a',
      input: '#ffffff',
      border: '#0a1520',
      primary: '#008fa8',
      'primary-foreground': '#ffffff',
      secondary: '#cc3800',
      'secondary-foreground': '#ffffff',
      accent: '#333333',
      'accent-foreground': '#ffffff',
      destructive: '#c41800',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'neural-ai',
    label: 'Neural AI',
    dark: {
      background: '#0e0620',
      foreground: '#d4c8f0',
      card: '#150c2e',
      muted: '#1e133d',
      'muted-foreground': '#6e5aa0',
      input: '#150c2e',
      border: '#d4c8f0',
      primary: '#6a5acd',
      'primary-foreground': '#e0f0ff',
      secondary: '#00bfff',
      'secondary-foreground': '#0e0620',
      accent: '#7fff00',
      'accent-foreground': '#0e0620',
      destructive: '#ff4466',
      'destructive-foreground': '#d4c8f0',
    },
    light: {
      background: '#f3f0ff',
      foreground: '#1a1030',
      card: '#ffffff',
      muted: '#e0d8f5',
      'muted-foreground': '#5a4a80',
      input: '#ffffff',
      border: '#1a1030',
      primary: '#4a3aad',
      'primary-foreground': '#ffffff',
      secondary: '#007faa',
      'secondary-foreground': '#ffffff',
      accent: '#4a8c00',
      'accent-foreground': '#ffffff',
      destructive: '#cc2244',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'hacktivist',
    label: 'Hacktivist',
    dark: {
      background: '#080810',
      foreground: '#e0fffc',
      card: '#0e0e1a',
      muted: '#161626',
      'muted-foreground': '#4a6a70',
      input: '#0e0e1a',
      border: '#00e5ff',
      primary: '#00e5ff',
      'primary-foreground': '#080810',
      secondary: '#e040fb',
      'secondary-foreground': '#080810',
      accent: '#76ff03',
      'accent-foreground': '#080810',
      destructive: '#ff1744',
      'destructive-foreground': '#e0fffc',
    },
    light: {
      background: '#f0fffd',
      foreground: '#0a1a1a',
      card: '#ffffff',
      muted: '#d4f5f0',
      'muted-foreground': '#3a5a5a',
      input: '#ffffff',
      border: '#0a1a1a',
      primary: '#008a99',
      'primary-foreground': '#ffffff',
      secondary: '#9c27b0',
      'secondary-foreground': '#ffffff',
      accent: '#4caf00',
      'accent-foreground': '#ffffff',
      destructive: '#c41230',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'deep-space',
    label: 'Deep Space',
    dark: {
      background: '#080808',
      foreground: '#33ff33',
      card: '#101010',
      muted: '#1a1a1a',
      'muted-foreground': '#1a8a1a',
      input: '#101010',
      border: '#33ff33',
      primary: '#33ff33',
      'primary-foreground': '#080808',
      secondary: '#ffaa00',
      'secondary-foreground': '#080808',
      accent: '#ff3333',
      'accent-foreground': '#080808',
      destructive: '#ff0000',
      'destructive-foreground': '#33ff33',
    },
    light: {
      background: '#f0f5f0',
      foreground: '#0a1a0a',
      card: '#ffffff',
      muted: '#d4e8d4',
      'muted-foreground': '#3a6a3a',
      input: '#ffffff',
      border: '#0a1a0a',
      primary: '#1a7a1a',
      'primary-foreground': '#ffffff',
      secondary: '#b37200',
      'secondary-foreground': '#ffffff',
      accent: '#cc2222',
      'accent-foreground': '#ffffff',
      destructive: '#b91c1c',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'red-eye',
    label: 'Red Eye',
    dark: {
      background: '#0a0a0a',
      foreground: '#f5f5f5',
      card: '#141414',
      muted: '#1e1e1e',
      'muted-foreground': '#808080',
      input: '#141414',
      border: '#f5f5f5',
      primary: '#ff0000',
      'primary-foreground': '#f5f5f5',
      secondary: '#f5f5f5',
      'secondary-foreground': '#0a0a0a',
      accent: '#ffd700',
      'accent-foreground': '#0a0a0a',
      destructive: '#cc0000',
      'destructive-foreground': '#f5f5f5',
    },
    light: {
      background: '#f5f0f0',
      foreground: '#1a1010',
      card: '#ffffff',
      muted: '#e8d8d8',
      'muted-foreground': '#6a5050',
      input: '#ffffff',
      border: '#1a1010',
      primary: '#b30000',
      'primary-foreground': '#ffffff',
      secondary: '#333333',
      'secondary-foreground': '#ffffff',
      accent: '#b39500',
      'accent-foreground': '#ffffff',
      destructive: '#8b0000',
      'destructive-foreground': '#ffffff',
    },
  },
  {
    name: 'neo-tokyo',
    label: 'Neo Tokyo',
    dark: {
      background: '#0d0815',
      foreground: '#f0e0ff',
      card: '#140e20',
      muted: '#1e1530',
      'muted-foreground': '#6a5080',
      input: '#140e20',
      border: '#f0e0ff',
      primary: '#ff1744',
      'primary-foreground': '#f0e0ff',
      secondary: '#651fff',
      'secondary-foreground': '#f0e0ff',
      accent: '#00e5ff',
      'accent-foreground': '#0d0815',
      destructive: '#ff0040',
      'destructive-foreground': '#f0e0ff',
    },
    light: {
      background: '#faf0ff',
      foreground: '#1a0e25',
      card: '#ffffff',
      muted: '#f0d8fa',
      'muted-foreground': '#5a3a70',
      input: '#ffffff',
      border: '#1a0e25',
      primary: '#c41030',
      'primary-foreground': '#ffffff',
      secondary: '#4a15cc',
      'secondary-foreground': '#ffffff',
      accent: '#0090a8',
      'accent-foreground': '#ffffff',
      destructive: '#b30030',
      'destructive-foreground': '#ffffff',
    },
  },
];

// ── Theme Service ──

// ── Contrast Utilities ──

function hexToLinear(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return [toLinear(r), toLinear(g), toLinear(b)];
}

function luminance(hex: string): number {
  const [r, g, b] = hexToLinear(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Returns '#000000' or '#ffffff' — whichever gives highest contrast against the background */
function maxContrastForeground(bgHex: string): string {
  const bgL = luminance(bgHex);
  const whiteContrast = contrastRatio(1, bgL);
  const blackContrast = contrastRatio(bgL, 0);
  return whiteContrast >= blackContrast ? '#ffffff' : '#000000';
}

@Injectable({ providedIn: 'root' })
export class HyperThemeService {
  private readonly doc = inject(DOCUMENT);

  private readonly _themeName = signal('cyber');
  private readonly _darkMode = signal(true);
  private readonly _highContrast = signal(false);
  private readonly _customThemes = signal<HyperThemeDefinition[]>([]);
  private readonly _hasStoredPreferences = signal(false);

  /** Current theme name */
  readonly themeName = this._themeName.asReadonly();

  /** Whether dark mode is active */
  readonly darkMode = this._darkMode.asReadonly();

  /** Whether high-contrast mode is active */
  readonly highContrast = this._highContrast.asReadonly();

  /** All available themes (built-in + custom) */
  readonly themes = computed(() => [...HYPER_THEMES, ...this._customThemes()]);

  /** Current active theme definition */
  readonly activeTheme = computed(() => {
    const name = this._themeName();
    return this.themes().find(t => t.name === name) ?? HYPER_THEMES[0];
  });

  constructor() {
    this.loadFromStorage();
    if (this._hasStoredPreferences()) {
      this.applyTheme();
    }
  }

  /** Set a theme by name */
  setTheme(name: string): void {
    if (!this.themes().find(t => t.name === name)) return;
    this._themeName.set(name);
    this.applyTheme();
    this.saveToStorage();
  }

  /** Toggle between dark and light mode */
  toggleDarkMode(): void {
    this._darkMode.update(v => !v);
    this.applyTheme();
    this.saveToStorage();
  }

  /** Set dark mode explicitly */
  setDarkMode(dark: boolean): void {
    this._darkMode.set(dark);
    this.applyTheme();
    this.saveToStorage();
  }

  /** Toggle high-contrast mode */
  toggleHighContrast(): void {
    this._highContrast.update(v => !v);
    this.applyTheme();
    this.saveToStorage();
  }

  /** Set high-contrast mode explicitly */
  setHighContrast(on: boolean): void {
    this._highContrast.set(on);
    this.applyTheme();
    this.saveToStorage();
  }

  /** Register a custom theme */
  registerTheme(theme: HyperThemeDefinition): void {
    this._customThemes.update(list => {
      const filtered = list.filter(t => t.name !== theme.name);
      return [...filtered, theme];
    });

    if (this._themeName() === theme.name && this._hasStoredPreferences()) {
      this.applyTheme();
    }
  }

  /** Apply current theme tokens to :root */
  private applyTheme(): void {
    const theme = this.activeTheme();
    const tokens = this._darkMode() ? theme.dark : theme.light;
    const root = this.doc.documentElement;
    const hc = this._highContrast();

    if (hc) {
      const tokenMap = tokens as unknown as Record<string, string>;
      // Apply tokens with forced maximum-contrast foregrounds
      for (const [key, value] of Object.entries(tokens)) {
        if (key.endsWith('-foreground')) {
          // Derive foreground from its matching background token
          const baseKey = key.replace('-foreground', '');
          const baseBg = tokenMap[baseKey] ?? tokens.background;
          root.style.setProperty(`--${key}`, maxContrastForeground(baseBg));
        } else {
          root.style.setProperty(`--${key}`, value);
        }
      }
      // Also recalculate foreground against background, muted-foreground against muted
      root.style.setProperty('--foreground', maxContrastForeground(tokens.background));
      root.style.setProperty('--muted-foreground', maxContrastForeground(tokens.muted));

      // Enhance structural tokens
      root.style.setProperty('--border-width', '6px');
      root.style.setProperty('--shadow-offset', '6px');
      root.classList.add('hyper-high-contrast');
    } else {
      for (const [key, value] of Object.entries(tokens)) {
        root.style.setProperty(`--${key}`, value);
      }
      root.style.setProperty('--border-width', '4px');
      root.style.setProperty('--shadow-offset', '4px');
      root.classList.remove('hyper-high-contrast');
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('hyper-theme', this._themeName());
      localStorage.setItem('hyper-dark-mode', String(this._darkMode()));
      localStorage.setItem('hyper-high-contrast', String(this._highContrast()));
    } catch {
      // Storage unavailable (SSR, private mode)
    }
  }

  private loadFromStorage(): void {
    try {
      const theme = localStorage.getItem('hyper-theme');
      const dark = localStorage.getItem('hyper-dark-mode');
      const hc = localStorage.getItem('hyper-high-contrast');
      const hasStoredPreferences = theme !== null || dark !== null || hc !== null;
      this._hasStoredPreferences.set(hasStoredPreferences);
      if (theme) this._themeName.set(theme);
      if (dark !== null) this._darkMode.set(dark !== 'false');
      if (hc !== null) this._highContrast.set(hc === 'true');
    } catch {
      // Storage unavailable
    }
  }
}
