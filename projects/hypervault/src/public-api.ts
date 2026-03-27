// ── Theming ──
export {
  HyperThemeService,
  HYPER_THEMES,
} from './lib/theming/theming';
export type {
  HyperThemeTokens,
  HyperThemeDefinition,
} from './lib/theming/theming';
export { HyperThemePicker } from './lib/theming/theme-picker';

// ── Core Defaults ──
export {
  HYPER_DEFAULTS,
  provideHyperDefaults,
} from './lib/core/defaults';
export type {
  HyperDefaults,
  HyperButtonDefaults,
  HyperCheckboxDefaults,
  HyperSwitchDefaults,
  HyperToolbarDefaults,
} from './lib/core/defaults';

// ── Badge ──
export { HyperBadge } from './lib/badge/badge';
export type { HyperBadgeVariant, HyperBadgeRarity } from './lib/badge/badge';

// ── Breadcrumb ──
export {
  HyperBreadcrumb,
  HyperBreadcrumbSeparator,
  HyperBreadcrumbService,
  HYPER_BREADCRUMB_HOME,
} from './lib/breadcrumb/breadcrumb';
export type {
  HyperBreadcrumbItem,
  HyperBreadcrumbData,
  HyperBreadcrumbHomeConfig,
} from './lib/breadcrumb/breadcrumb';

// ── Button ──
export { HyperButton } from './lib/button/button';
export type { HyperButtonColor, HyperButtonSize, HyperHoverEffect } from './lib/button/button';

// ── Checkbox ──
export { HyperCheckbox } from './lib/checkbox/checkbox';
export type { HyperCheckboxColor } from './lib/checkbox/checkbox';

// ── Density ──
export { HyperDensityDirective, HYPER_DENSITY, provideHyperDensity } from './lib/density/density';
export type { HyperDensity } from './lib/density/density';

// ── Form Field ──
export { HyperFormField, HyperPrefix, HyperSuffix } from './lib/form-field/form-field';

// ── Icon ──
export { HyperIcon } from './lib/icon/icon';

// ── Sidenav ──
export { HyperSidenav, HyperSidenavContainer, HyperSidenavContent } from './lib/sidenav/sidenav';
export type { HyperSidenavMode, HyperSidenavPosition } from './lib/sidenav/sidenav';

// ── Slider ──
export { HyperSlider } from './lib/slider/slider';
export type { HyperSliderColor } from './lib/slider/slider';

// ── Switch ──
export { HyperSwitch } from './lib/switch/switch';
export type { HyperSwitchColor } from './lib/switch/switch';

// ── Toolbar ──
export {
  HyperToolbar,
  HyperToolbarStart,
  HyperToolbarCenter,
  HyperToolbarEnd,
  HyperToolbarSeparator,
  HyperToolbarTitle,
  HyperToolbarRow,
} from './lib/toolbar/toolbar';
export type { HyperToolbarColor, HyperToolbarSize } from './lib/toolbar/toolbar';

// ── Alert ──
export {
  HyperAlert,
  HyperAlertIcon,
  HyperAlertTitle,
  HyperAlertActions,
} from './lib/alert/alert';
export type { HyperAlertVariant } from './lib/alert/alert';

// ── Snackbar ──
export {
  HyperSnackbar,
  HyperSnackbarComponent,
  HYPER_SNACKBAR_DEFAULTS,
} from './lib/snackbar/snackbar';
export type {
  HyperSnackbarVariant,
  HyperSnackbarPosition,
  HyperSnackbarConfig,
  HyperSnackbarRef,
  HyperSnackbarDefaults,
} from './lib/snackbar/snackbar';

// ── Progress Bar ──
export { HyperProgressBar } from './lib/progress-bar/progress-bar';
export type { HyperProgressBarColor, HyperProgressBarMode } from './lib/progress-bar/progress-bar';

// ── Spinner ──
export { HyperSpinner } from './lib/spinner/spinner';
export type { HyperSpinnerColor, HyperSpinnerMode } from './lib/spinner/spinner';

// ── Tabs ──
export {
  HyperTabGroup,
  HyperTab,
  HyperTabLabel,
  HyperTabLazyContent,
} from './lib/tabs/tabs';
export type { HyperTabsColor, HyperTabsAlign } from './lib/tabs/tabs';

// ── Accordion ──
export {
  HyperAccordion,
  HyperExpansionPanel,
  HyperAccordionHeader,
} from './lib/accordion/accordion';

// ── Radio ──
export { HyperRadioGroup, HyperRadioButton } from './lib/radio/radio';
export type { HyperRadioColor, HyperRadioLayout } from './lib/radio/radio';

// ── Select ──
export { HyperSelect, HyperOption, HyperOptGroup, HyperSelectTrigger } from './lib/select/select';

// ── Chip ──
export { HyperChip, HyperChipSet, HyperChipInput } from './lib/chip/chip';
export type { HyperChipColor, HyperChipVariant, HyperChipSelectionMode } from './lib/chip/chip';

// ── Divider ──
export { HyperDivider } from './lib/divider/divider';
export type { HyperDividerColor, HyperDividerThickness } from './lib/divider/divider';

// ── Tooltip ──
export { HyperTooltip, HyperTooltipComponent } from './lib/tooltip/tooltip';
export type { HyperTooltipPosition } from './lib/tooltip/tooltip';

// ── Dialog ──
export {
  HyperDialog,
  HyperDialogContainer,
  HyperDialogRef,
  HyperDialogTitle,
  HyperDialogContent,
  HyperDialogActions,
  HYPER_DIALOG_DATA,
} from './lib/dialog/dialog';
export type { HyperDialogConfig } from './lib/dialog/dialog';

// ── List ──
export {
  HyperList,
  HyperListItem,
  HyperListItemIcon,
  HyperListItemMeta,
  HyperListItemLine,
  HyperListDivider,
  HyperListSubheader,
  HyperSelectionList,
  HyperListOption,
} from './lib/list/list';

// ── Table ──
export {
  HyperTable,
  HyperColumnDef,
  HyperCellDef,
  HyperHeaderCellDef,
  HyperFooterCellDef,
  HyperSortHeader,
  HyperNoDataRow,
} from './lib/table/table';
export type { HyperSortDirection, HyperSortEvent } from './lib/table/table';

// ── Paginator ──
export { HyperPaginator } from './lib/paginator/paginator';
export type { HyperPageEvent } from './lib/paginator/paginator';

// ── Menu ──
export {
  HyperMenu,
  HyperMenuItem,
  HyperMenuDivider,
  HyperMenuGroup,
  HyperMenuTrigger,
} from './lib/menu/menu';

// ── Stepper ──
export {
  HyperStepper,
  HyperStep,
  HyperStepLabel,
  HyperStepperPrevious,
  HyperStepperNext,
} from './lib/stepper/stepper';

// ── Datepicker ──
export {
  HyperDatepicker,
  HyperCalendar,
  HyperDatepickerToggle,
} from './lib/datepicker/datepicker';

// ── Tree ──
export {
  HyperTree,
  HyperTreeNode,
  HyperTreeNodeToggle,
} from './lib/tree/tree';
export type { HyperTreeNodeData } from './lib/tree/tree';

// ── Page Summary ──
export { HyperPageSummary, HyperPageSummaryList } from './lib/page-summary/page-summary';
export type { HyperTocEntry, HyperPageSummaryPosition } from './lib/page-summary/page-summary';
