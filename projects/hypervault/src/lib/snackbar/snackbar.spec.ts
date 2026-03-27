import { TestBed } from '@angular/core/testing';
import { HyperSnackbar } from './snackbar';

describe('HyperSnackbar', () => {
  let service: HyperSnackbar;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HyperSnackbar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open and dismiss', async () => {
    const ref = service.open({ message: 'Test', duration: 0 });
    expect(document.querySelector('hyper-snackbar')).toBeTruthy();
    ref.dismiss();
    // Wait for exit animation
    await new Promise(r => setTimeout(r, 300));
    expect(document.querySelector('hyper-snackbar')).toBeFalsy();
  });
});
