import { DialogConfig } from '@angular/cdk/dialog';

export class ApparelProDialog {
  constructor(classname: string) {
    classname = '';
    const apparelProDialogConfig = new DialogConfig();
    apparelProDialogConfig.height = '600px';
    apparelProDialogConfig.width = '750px';
    apparelProDialogConfig.backdropClass = ['backdrop'];
    apparelProDialogConfig.panelClass = ['shadow-effects', 'dialog-color'];
    // apparelProDialogConfig.data = { model: entry };
  }
}
