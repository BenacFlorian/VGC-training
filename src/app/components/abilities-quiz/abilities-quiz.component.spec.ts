import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AbilitiesQuizComponent } from './abilities-quiz.component';

describe('AbilitiesQuizComponent', () => {
  let component: AbilitiesQuizComponent;
  let fixture: ComponentFixture<AbilitiesQuizComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AbilitiesQuizComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AbilitiesQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
