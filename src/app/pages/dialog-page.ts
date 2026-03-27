import { Component, inject } from '@angular/core';
import { HyperButton } from 'hypervault/button';
import {
  HyperDialog,
  HyperDialogRef,
  HyperDialogTitle,
  HyperDialogContent,
  HyperDialogActions,
  HYPER_DIALOG_DATA,
} from 'hypervault/dialog';
// ── Example Dialog Components ──

@Component({
  selector: 'example-basic-dialog',
  imports: [HyperDialogTitle, HyperDialogContent, HyperDialogActions, HyperButton],
  template: `
    <hyper-dialog-title>Confirmar Acao</hyper-dialog-title>
    <hyper-dialog-content>
      <p>Tem certeza que deseja prosseguir? Esta acao nao pode ser desfeita.</p>
    </hyper-dialog-content>
    <hyper-dialog-actions>
      <button hyper-stroked-button (click)="dialogRef.close()">Cancelar</button>
      <button hyper-raised-button (click)="dialogRef.close('confirmed')">Confirmar</button>
    </hyper-dialog-actions>
  `,
})
export class ExampleBasicDialog {
  readonly dialogRef = inject(HyperDialogRef);
}

@Component({
  selector: 'example-data-dialog',
  imports: [HyperDialogTitle, HyperDialogContent, HyperDialogActions, HyperButton],
  template: `
    <hyper-dialog-title>{{ data.title }}</hyper-dialog-title>
    <hyper-dialog-content>
      <p>{{ data.message }}</p>
    </hyper-dialog-content>
    <hyper-dialog-actions>
      <button hyper-raised-button (click)="dialogRef.close()">OK</button>
    </hyper-dialog-actions>
  `,
})
export class ExampleDataDialog {
  readonly dialogRef = inject(HyperDialogRef);
  readonly data = inject<{ title: string; message: string }>(HYPER_DIALOG_DATA);
}

// ── Demo Page ──

@Component({
  selector: 'app-dialog-page',
  imports: [HyperButton],
  templateUrl: './dialog-page.html',
})
export class DialogPage {
  private readonly dialog = inject(HyperDialog);
  result = '';

  openBasic(): void {
    const ref = this.dialog.open(ExampleBasicDialog);
    ref.afterClosed().subscribe(r => {
      this.result = r ? `Resultado: ${r}` : 'Fechado sem resultado';
    });
  }

  openWithData(): void {
    this.dialog.open(ExampleDataDialog, {
      data: {
        title: 'Notificacao',
        message: 'Operacao realizada com sucesso!',
      },
      width: '400px',
    });
  }

  openWide(): void {
    this.dialog.open(ExampleBasicDialog, {
      width: '700px',
      maxHeight: '300px',
    });
  }

  openNoClose(): void {
    const ref = this.dialog.open(ExampleBasicDialog, {
      disableClose: true,
    });
  }
}
