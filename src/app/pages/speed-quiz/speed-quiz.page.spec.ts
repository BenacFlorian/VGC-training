import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpeedQuizPage } from './speed-quiz.page';

describe('SpeedQuizPage', () => {
  let component: SpeedQuizPage;
  let fixture: ComponentFixture<SpeedQuizPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedQuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
