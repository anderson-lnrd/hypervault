import { Component, inject } from '@angular/core';
import { HyperButton } from 'hypervault/button';
import { HyperSnackbar } from 'hypervault/snackbar';
@Component({
  selector: 'app-snackbar-page',
  imports: [HyperButton],
  templateUrl: './snackbar-page.html',
})
export class SnackbarPage {
  private readonly snackbar = inject(HyperSnackbar);

  openBasic(): void {
    this.snackbar.open({ message: 'Operacao realizada.' });
  }

  openWithAction(): void {
    const ref = this.snackbar.open({
      message: 'Item removido.',
      action: 'Desfazer',
      duration: 6000,
    });
    ref.afterDismissed().then(actionClicked => {
      if (actionClicked) {
        this.snackbar.success('Item restaurado!');
      }
    });
  }

  openSuccess(): void {
    this.snackbar.success('Salvo com sucesso!');
  }

  openError(): void {
    this.snackbar.error('Falha ao conectar ao servidor.');
  }

  openWarning(): void {
    this.snackbar.warning('Sua sessao expira em 5 minutos.');
  }

  openWithIcon(): void {
    this.snackbar.open({
      message: 'Novo email recebido!',
      icon: 'mail',
      variant: 'default',
    });
  }

  openTopCenter(): void {
    this.snackbar.open({
      message: 'Notificacao no topo!',
      position: 'top-center',
    });
  }

  openTopLeft(): void {
    this.snackbar.open({
      message: 'Topo esquerdo.',
      position: 'top-left',
    });
  }

  openBottomRight(): void {
    this.snackbar.open({
      message: 'Inferior direito.',
      position: 'bottom-right',
    });
  }

  openLong(): void {
    this.snackbar.open({
      message: 'Este snackbar fica visivel por mais tempo para leitura.',
      duration: 10000,
    });
  }

  openPersistent(): void {
    this.snackbar.open({
      message: 'Este snackbar nao fecha automaticamente.',
      action: 'Fechar',
      duration: 0,
    });
  }
}
