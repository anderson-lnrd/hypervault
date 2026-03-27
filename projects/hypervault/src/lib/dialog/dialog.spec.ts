import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HyperDialog, HyperDialogTitle, HyperDialogContent, HyperDialogActions, HyperDialogRef } from './dialog';

@Component({
  selector: 'test-dialog-content',
  imports: [HyperDialogTitle, HyperDialogContent, HyperDialogActions],
  template: `
    <hyper-dialog-title>Test Dialog</hyper-dialog-title>
    <hyper-dialog-content>Content here</hyper-dialog-content>
    <hyper-dialog-actions><button (click)="dialogRef.close()">OK</button></hyper-dialog-actions>
  `,
})
class TestDialogComponent {
  constructor(public dialogRef: HyperDialogRef) {}
}

describe('HyperDialog', () => {
  it('should open and close', async () => {
    await TestBed.configureTestingModule({ imports: [TestDialogComponent] }).compileComponents();
    const dialog = TestBed.inject(HyperDialog);
    const ref = dialog.open(TestDialogComponent);
    expect(ref).toBeTruthy();
    ref.close();
  });
});
