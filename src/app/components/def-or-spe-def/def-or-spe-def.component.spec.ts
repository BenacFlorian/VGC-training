import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DefOrSpeDefComponent } from './def-or-spe-def.component';

describe('DefOrSpeDefComponent', () => {
  let component: DefOrSpeDefComponent;
  let fixture: ComponentFixture<DefOrSpeDefComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DefOrSpeDefComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DefOrSpeDefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
